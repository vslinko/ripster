import path from 'path'
import _glob from 'glob'

export const root = path.join(__dirname, '..')

export function main(programm) {
  Promise.resolve(programm())
    .then(
      () => {
        process.exit(0)
      },
      (err) => {
        console.log(err.stack)
        process.exit(1)
      }
    )
}

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

export const glob = promisifyNode(_glob)
