import {readFileAsync, writeFileAsync, unlinkAsync} from 'fs-extra-promise'
import R from 'ramda'
import yargs from 'yargs'
import {join} from 'path'
import {main, glob, rootDir} from '../utils'
import {parseBlocks, parseFeatures, compileGherkin} from 'adsoft-gherkin'

const {argv} = yargs
  .string(['o', 'l'])
  .alias('o', 'output-dir')
  .default('o', 'features-dist')
  .alias('l', 'default-language')

const {
  outputDir,
  defaultLanguage
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

main(async () => {
  const oldFeaturesFilePathes = await glob(join(outputDir, '**', '*.feature'))

  await* removeFiles(oldFeaturesFilePathes)

  const filePathes = await glob(join(rootDir, 'planned-features', '**', '*.md'))
  const files = await* readFiles(filePathes)
  const features = getFeaturesFromFiles({defaultLanguage}, files)

  await* features
    .map(async (feature, index) => writeFileAsync(
      join(outputDir, `${index}.feature`),
      await compileGherkin(feature.ast)
    ))
})
