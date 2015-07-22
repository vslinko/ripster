import {uniq} from 'ramda'
import path from 'path'
import {root, main, glob} from '../utils'

main(async () => {
  const definitionFiles = await glob(
    path.join(root, 'features', 'step-definitions', '**', '*.js')
  )

  const defs = []
  const world = {
    Given(regex) {
      defs.push(
        regex.toString()
          .replace(/^\/\^?/, '')
          .replace(/\$?\/[a-z]*$/, '')
          .replace(/\(\[\^\"\]\*\)/g, '%VAR%')
      )
    }
  }

  definitionFiles
    .forEach((file) => {
      global.component = () => ({})
      require(file).call(world)
    })

  uniq(defs)
    .sort()
    .forEach((key) => {
      console.log(key)
    })
})
