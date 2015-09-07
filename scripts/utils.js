import inquirer from 'inquirer';
import {join} from 'path';
import {writeFileAsync, readFileAsync} from 'fs-extra-promise';
import nodeGlob from 'glob';
import mustache from 'mustache';

export const rootDir = join(__dirname, '..');
export const srcDir = join(rootDir, 'src');
export const bundlesDir = join(srcDir, 'frontend', 'bundles');

function promisifyNode(cb) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      cb(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

export const glob = promisifyNode(nodeGlob);

export function underscore(string) {
  return [
    string[0]
      .toLowerCase(),

    string
      .slice(1)
      .replace(/[A-Z]/g, c => `_${c.toLowerCase()}`),
  ].join('');
}

export async function main(programm) {
  try {
    await programm();
    process.exit(0);
  } catch (err) {
    console.log(err.stack); // eslint-disable-line no-console
    process.exit(1);
  }
}

export function getAnswers(questions) {
  return new Promise(resolve => {
    inquirer.prompt(
      questions
        .map(question => {
          if (!question.validate) {
            return question;
          }

          const asyncValidate = question.validate;

          return {
            ...question,
            validate(...args) {
              const cb = this.async();

              asyncValidate(...args)
                .then(cb, cb);
            },
          };
        }),

      resolve
    );
  });
}

export function mainAnswers(questions, programm) {
  main(async () => {
    const answers = await getAnswers(questions);

    await programm(answers);
  });
}

export function write(filePath, content) {
  return writeFileAsync(
    filePath,
    content.trim() + '\n'
  );
}

export async function readTemplate(name) {
  const buffer = await readFileAsync(
    join(__dirname, 'templates', name + '.mustache')
  );

  return buffer.toString('utf8');
}

export async function renderTemplate(file, name, context) {
  const template = await readTemplate(name);

  await write(
    file,
    mustache.render(template, context)
  );
}
