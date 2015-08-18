import {readFileAsync, writeFileAsync, unlinkAsync, existsAsync, mkdirAsync} from 'fs-extra-promise'
import R from 'ramda'
import yargs from 'yargs'
import {join} from 'path'
import {main, glob, rootDir} from '../utils'
import {parseBlocks, parseFeatures, compileGherkin} from 'adsoft-gherkin'

const defaultTag = process.env.CIRCLE_BRANCH && /^#\d+$/.test(process.env.CIRCLE_BRANCH)
  ? '@issue-' + process.env.CIRCLE_BRANCH.slice(1)
  : '@stage5'

const {argv} = yargs
  .string(['o', 'l', 't'])
  .alias('o', 'output-dir')
  .default('o', 'features-dist')
  .alias('l', 'default-language')
  .alias('t', 'tag')
  .default('t', defaultTag)

const {
  outputDir,
  defaultLanguage,
  tag,
} = argv

const removeFiles = R.map(unlinkAsync)

const readFile = async filePath => ({
  path: readFileAsync,
  content: (await readFileAsync(filePath)).toString()
})

const readFiles = R.map(readFile)

function safe(fn) {
  return (...args) => {
    try {
      return fn(...args)
    } catch (err) {
      return
    }
  }
}

const safeMap = fn => R.pipe(
  R.map(safe(fn)),
  R.filter(value => value !== undefined)
)

const getFeaturesFromFiles = R.curry(R.uncurryN(2, (options) => R.pipe(
  R.map(file => parseBlocks(file.content).map(block => ({
    file,
    block
  }))),
  R.flatten,
  R.filter(({block}) => block.type === 'feature'),
  safeMap(({file, block}) => parseFeatures(options, block).map(ast => ({
    file,
    block,
    ast
  }))),
  R.flatten
)))

const hasTag = (tag) => (feature) => {
  const scenarioDefinition = R.head(feature.ast.scenarioDefinitions)
  const tags = scenarioDefinition.tags.map(R.prop('name'))

  return tags.indexOf(tag) >= 0
}

main(async () => {
  if (await existsAsync(outputDir)) {
    const oldFeaturesFilePathes = await glob(join(outputDir, '**', '*.feature'))

    await* removeFiles(oldFeaturesFilePathes)
  } else {
    await mkdirAsync(outputDir)
  }

  const filePathes = await glob(join(rootDir, 'planned-features', '**', '*.md'))
  const files = await* readFiles(filePathes)
  let features = getFeaturesFromFiles({defaultLanguage}, files)

  if (tag) {
    features = features.filter(hasTag(tag))
  }

  await* features
    .map(async (feature, index) => writeFileAsync(
      join(outputDir, `${index}.feature`),
      await compileGherkin(feature.ast)
    ))
})
