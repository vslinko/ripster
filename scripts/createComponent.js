import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs-extra-promise'
import mustache from 'mustache'

const indexTemplate = `
export {default as {{name}}} from './{{name}}'
{{#createContainer}}
export {default as {{name}}Container} from './{{name}}Container'
{{/createContainer}}
`

const componentTemplate = `
import React, {PropTypes} from 'react'
import testDecorator from '../../utils/testDecorator'
import childrenToProps from '../../utils/childrenToProps'

{{#createLess}}
import './{{name}}.less'

{{/createLess}}
@childrenToProps
@testDecorator()
export default class {{name}} {
  static propTypes = {
    children: PropTypes.node,
    gettext: PropTypes.func.isRequired
  }

  render() {
    const {
      gettext
    } = this.props

    return (
      <div>
        <div>{gettext('{{name}}')}</div>
        <div>{this.props.children}</div>
      </div>
    )
  }
}
`

const containerTemplate = `
import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {gettext} from '../../utils/gettext'

import {{name}} from './{{name}}'

@connect(state => ({
  gettext: gettext(state.locale.messages)
}))
export default class {{name}}Container {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const {dispatch, ...props} = this.props

    return (
      <{{name}}
        {...props}
        {...bindActionCreators({
        }, dispatch)}
      />
    )
  }
}
`

const lessTemplate = `
.{{cssName}} {

}
`

function underscore(string) {
  return string[0].toLowerCase()
    + string.slice(1).replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
}

function getDirectory(name) {
  return path.join(
    __dirname, '..', 'src', 'shared', 'components', name
  )
}

function write(filePath, content) {
  return fs.writeFileAsync(
    filePath,
    content.trim() + '\n'
  )
}

async function createComponent({name, createContainer, createLess}) {
  const directory = getDirectory(name)

  const context = {
    name,
    cssName: underscore(name),
    createContainer,
    createLess
  }

  await fs.mkdirAsync(directory)

  await* [
    write(
      path.join(directory, 'index.js'),
      mustache.render(indexTemplate, context)
    ),

    write(
      path.join(directory, `${name}.js`),
      mustache.render(componentTemplate, context)
    ),

    createContainer && write(
      path.join(directory, `${name}Container.js`),
      mustache.render(containerTemplate, context)
    ),

    createLess && write(
      path.join(directory, `${name}.less`),
      mustache.render(lessTemplate, context)
    )
  ]
}

function getAnswers(questions) {
  return new Promise(resolve => {
    inquirer.prompt(questions, resolve)
  })
}

async function main() {
  try {
    const answers = await getAnswers([
      {
        type: 'input',
        name: 'name',
        message: 'Component name',
        validate(name) {
          if (!/[A-Z]/.test(name[0])) {
            return 'Component name must be in CamelCase'
          }

          if (fs.existsSync(getDirectory(name))) {
            return `Component "${name}" already exists`
          }

          return true
        }
      },
      {
        type: 'confirm',
        name: 'createContainer',
        message: 'Create container component'
      },
      {
        type: 'confirm',
        name: 'createLess',
        message: 'Create less file'
      }
    ])

    await createComponent(answers)
  } catch (err) {
    console.log(err.stack) // eslint-disable-line no-console
  }
}

main()
