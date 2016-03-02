import { existsAsync, mkdirAsync } from 'fs-extra-promise';
import { join } from 'path';
import {
  mainAnswers,
  dashify,
  renderTemplate,
  bundlesDir,
} from '../utils';

const questions = [
  {
    type: 'input',
    name: 'bundleName',
    message: 'Bundle name',
    async validate(name) {
      if (!(await existsAsync(join(bundlesDir, name)))) {
        return `Bundle "${name}" doesn't exists`;
      }

      return true;
    },
  },
  {
    type: 'input',
    name: 'name',
    message: 'Component name',
    async validate(name, answers) {
      if (!/[A-Z]/.test(name[0])) {
        return 'Component name must be in CamelCase';
      }

      if (await existsAsync(join(bundlesDir, answers.bundleName, 'components', name))) {
        return `Component "${name}" already exists`;
      }

      return true;
    },
  },
  {
    type: 'confirm',
    name: 'less',
    message: 'Create less file',
  },
  {
    type: 'input',
    name: 'css',
    message: 'CSS class name',
    default(answers) {
      return dashify(answers.name);
    },
    when(answers) {
      return answers.less;
    },
  },
  {
    type: 'confirm',
    name: 'container',
    message: 'Create container component',
  },
];

mainAnswers(questions, async (context) => {
  const directory = join(bundlesDir, context.bundleName, 'components', context.name);

  await mkdirAsync(directory);

  await Promise.all([
    renderTemplate(
      join(directory, 'index.js'),
      join('component', 'index.js'),
      context
    ),

    renderTemplate(
      join(directory, `${context.name}.js`),
      join('component', 'component.js'),
      context
    ),

    context.container && renderTemplate(
      join(directory, `${context.name}Container.js`),
      join('component', 'container.js'),
      context
    ),

    context.less && renderTemplate(
      join(directory, `${context.name}.less`),
      join('component', 'component.less'),
      context
    ),
  ]);
});
