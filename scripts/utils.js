import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs-extra-promise'
import nodeGlob from 'glob'
import mustache from 'mustache'

export {default as fs} from 'fs-extra-promise'

export const root = path.join(__dirname, '..')
export const src = path.join(root, 'src')
export const components = path.join(src, 'shared', 'components')

export const join = path.join

function promisifyNode(cb) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      cb(...args, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

export const glob = promisifyNode(nodeGlob)

export function underscore(string) {
  return [
    string[0]
      .toLowerCase(),

    string
      .slice(1)
      .replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
  ].join('')
}

export async function main(programm) {
  try {
    await programm()
    process.exit(0)
  } catch (err) {
    console.log(err.stack)
    process.exit(1)
  }
}

export function mainAnswers(questions, programm) {
  main(async () => {
    const answers = await getAnswers(questions)

    await programm(answers)
  })
}

export function getAnswers(questions) {
  return new Promise(resolve => {
    inquirer.prompt(
      questions
        .map(question => {
          if (question.validate) {
            const asyncValidate = question.validate

            question = {
              ...question,
              validate(...args) {
                const cb = this.async()

                asyncValidate(...args)
                  .then(cb, cb)
              }
            }
          }

          return question
        }),

      resolve
    )
  })
}

export function write(filePath, content) {
  return fs.writeFileAsync(
    filePath,
    content.trim() + '\n'
  )
}

export async function readTemplate(name) {
  const buffer = await fs.readFileAsync(
    join(__dirname, 'templates', name + '.mustache')
  )

  return buffer.toString('utf8')
}

export async function renderTemplate(file, name, context) {
  const template = await readTemplate(name)

  await write(
    file,
    mustache.render(template, context)
  )
}
