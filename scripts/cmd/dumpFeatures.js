import {unlinkAsync} from 'fs-extra-promise'
import yargs from 'yargs'
import {join} from 'path'
import {main, glob, renderTemplate} from '../utils'
import {parseFeatures, blockUniqueName} from '../parseFeatures'

const {argv} = yargs
  .string(['o', 'l'])
  .alias('o', 'output-dir')
  .default('o', 'features-dist')
  .alias('l', 'default-language')

const {
  outputDir,
  defaultLanguage
} = argv

main(async () => {
  const oldFeatures = await glob(join(outputDir, '**', '*.feature'))

  await* oldFeatures
    .map(file => unlinkAsync(file))

  const newFeatures = await parseFeatures({defaultLanguage})

  await* newFeatures
    .filter(block => block.stage >= 3)
    .map(block => renderTemplate(
      join(outputDir, blockUniqueName(block)),
      join('feature', 'feature'),
      block
    ))
})
