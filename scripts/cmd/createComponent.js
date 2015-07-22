import {
  join,
  fs,
  mainAnswers,
  underscore,
  renderTemplate,
  components
} from '../utils'

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Component name',
    async validate(name) {
      if (!/[A-Z]/.test(name[0])) {
        return 'Component name must be in CamelCase'
      }

      if (await fs.existsAsync(join(components, name))) {
        return `Component "${name}" already exists`
      }

      return true
    }
  },
  {
    type: 'confirm',
    name: 'less',
    message: 'Create less file'
  },
  {
    type: 'input',
    name: 'css',
    message: 'CSS class name',
    default(answers) {
      return underscore(answers.name)
    },
    when(answers) {
      return answers.less
    }
  },
  {
    type: 'confirm',
    name: 'container',
    message: 'Create container component'
  }
]

mainAnswers(questions, async (context) => {
  const directory = join(components, context.name)

  await fs.mkdirAsync(directory)

  await* [
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
    )
  ]
})
