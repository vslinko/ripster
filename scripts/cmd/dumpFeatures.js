import { readFileAsync, writeFileAsync, unlinkAsync, existsAsync, mkdirAsync } from 'fs-extra-promise';
import R from 'ramda';
import yargs from 'yargs';
import { join } from 'path';
import { main, glob, rootDir } from '../utils';
import { parseBlocks, parseFeatures, compileGherkin } from 'adsoft-gherkin';

const { argv } = yargs
  .string(['o', 'l', 't'])
  .alias('o', 'output-dir')
  .default('o', 'features')
  .alias('l', 'default-language')
  .alias('t', 'tag')
  .default('t', '@dev_ok');

const {
  outputDir,
  defaultLanguage,
  tag,
} = argv;

const removeFiles = files => Promise.all(R.map(unlinkAsync, files));

const readFile = async filePath => ({
  path: readFileAsync,
  content: (await readFileAsync(filePath)).toString(),
});

const readFiles = files => Promise.all(R.map(readFile, files));

const noop = {};

function safe(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (err) {
      return noop;
    }
  };
}

const safeMap = fn => R.pipe(
  R.map(safe(fn)),
  R.filter(value => value !== noop)
);

const getFeaturesFromFiles = R.curry(R.uncurryN(2, (options) => R.pipe(
  R.map(file => parseBlocks(file.content).map(block => ({
    file,
    block,
  }))),
  R.flatten,
  R.filter(({ block }) => block.type === 'feature'),
  safeMap(({ file, block }) => parseFeatures(options, block).map(ast => ({
    file,
    block,
    ast,
  }))),
  R.flatten
)));

const hasTag = (tagFilter) => (feature) => {
  const scenarioDefinition = R.head(feature.ast.scenarioDefinitions);
  const tags = scenarioDefinition.tags.map(R.prop('name'));

  return tags.indexOf(tagFilter) >= 0;
};

main(async () => {
  if (await existsAsync(outputDir)) {
    const oldFeaturesFilePathes = await glob(join(outputDir, '**', '*.feature'));

    await removeFiles(oldFeaturesFilePathes);
  } else {
    await mkdirAsync(outputDir);
  }

  const filePathes = await glob(join(rootDir, 'planned-features', '**', '*.md'));
  const files = await readFiles(filePathes);
  let features = getFeaturesFromFiles({ defaultLanguage }, files);

  if (tag) {
    features = features.filter(hasTag(tag));
  }

  await Promise.all(
    features
      .map(async (feature, index) => writeFileAsync(
        join(outputDir, `${index}.feature`),
        await compileGherkin(feature.ast)
      ))
  );
});
