import { existsAsync, mkdirAsync } from 'fs-extra-promise';
import { join } from 'path';
import {
  mainAnswers,
  bundlesDir,
} from '../utils';

const questions = [
  {
    type: 'input',
    name: 'bundleName',
    message: 'Bundle name',
    async validate(name) {
      if (await existsAsync(join(bundlesDir, name))) {
        return `Bundle "${name}" already exists`;
      }

      return true;
    },
  },
];

mainAnswers(questions, async (context) => {
  const directory = join(bundlesDir, context.bundleName);

  await mkdirAsync(directory);
  await mkdirAsync(join(directory, 'components'));
});
