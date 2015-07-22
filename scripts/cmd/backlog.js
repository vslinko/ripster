import R from 'ramda'
import keywords from 'gherkin/lib/gherkin/gherkin-languages.json'
import colors from 'colors/safe'
import yargs from 'yargs'
import {parseFeatures} from '../parseFeatures'
import {main} from '../utils'

const {argv} = yargs
  .boolean(['a', 'v', 'c'])
  .string('l')
  .alias('a', 'include-all')
  .alias('v', 'verbose')
  .alias('c', 'no-colors')
  .alias('s', 'min-stage')
  .alias('l', 'default-language')

const {
  includeAll,
  verbose,
  noColors,
  minStage,
  defaultLanguage
} = argv

// common helpers

const isNotEmpty = R.complement(R.isEmpty)

const asc = (a, b) => {
  if (a === b) {
    return 0
  } else {
    return a > b ? 1 : -1
  }
}

const desc = R.compose(R.negate, asc)

const compareByProp = R.curry((prop, comparator) => (a, b) =>
  comparator(R.prop(prop, a), R.prop(prop, b))
)

const combineComparators = (...comparators) => {
  return (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b)

      if (result !== 0) {
        return result
      }
    }

    return 0
  }
}

const doIf = (cond, fn) => R.cond([
  [cond, fn],
  [R.T, R.identity]
])

// output helpers

const label = R.curry(function label(color, message) {
  return color(` ${message.trim()} `)
})

function titleColor(message) {
  if (noColors || !verbose) {
    return message
  }

  return colors.green.underline(message)
}

function deadlineColor(message) {
  if (noColors) {
    return message
  }

  return label(colors.bgRed.black, message)
}

const stageColor = R.curry(function stageColor(stage, message) {
  if (noColors) {
    return message
  }

  switch (stage) {
    case 4:
      return label(colors.bgGreen.black, message)
    case 3:
      return label(colors.bgRed.black, message)
    case 2:
      return label(colors.bgYellow.black, message)
    case 1:
      return label(colors.bgCyan.black, message)
    case 0:
    default:
      return label(colors.bgMagenta.black, message)
  }
})

const priorityColor = R.curry(function priorityColor(priority, message) {
  if (noColors) {
    return message
  }

  switch (priority) {
    case 0:
      return label(colors.bgRed.black, message)
    case 1:
      return label(colors.bgYellow.black, message)
    case 2:
      return label(colors.bgCyan.black, message)
    case 3:
    default:
      return label(colors.bgGreen.black, message)
  }
})

const prependLine = line => {
  const trimmed = line.trim()

  return trimmed === ''
    ? trimmed
    : `\t${trimmed}`
}

const prependLines = R.map(prependLine)

const isPadded = R.pipe(R.last, R.equals(''))
const isNotPadded = R.complement(isPadded)
const ensurePadding = doIf(isNotPadded, R.append(''))

// helpers for scenarios

const filterBlocks = R.filter(block => {
  if (includeAll) {
    return true
  }

  if (minStage === undefined) {
    return block.stage === 3
  }

  return block.stage >= minStage
})

const sortBlocks = R.sort(combineComparators(
  compareByProp('stage', desc),
  compareByProp('priority', asc),
  compareByProp('deadline', asc),
  compareByProp('functional', asc)
))

function getScenarioName(language, line) {
  const scenarioKeywords = keywords[language].scenario

  for (const keyword of scenarioKeywords) {
    const re = new RegExp('^\s*' + keyword + '\s*:(.+)$')
    const matches = re.exec(line)

    if (matches) {
      return matches[1].trim()
    }
  }

  return null
}

const getBlockScenarioNames = block => {
  return block.content
    .split('\n')
    .map(line => getScenarioName(block.language, line))
    .filter(matches => matches)
}

const getScenariosFromBlock = block => {
  return getBlockScenarioNames(block)
    .map(scenario => ({
      ...block,
      scenario
    }))
}

const getScenariosFromBlocks = R.pipe(
  filterBlocks,
  sortBlocks,
  R.map(getScenariosFromBlock),
  R.flatten
)

// helpers for groups

const getScenarioGroup = ({stage, priority}) => {
  const stageText = stageColor(stage, `Stage ${stage}`)

  const priorityText = priorityColor(priority,
    priority === undefined
      ? 'No Priority'
      : `Priority ${priority}`
  )

  const separator = noColors ? ', ' : ' '

  return [
    stageText,
    priorityText
  ].join(separator)
}

const getGroupsFromScenarios = R.pipe(
  R.groupBy(getScenarioGroup),
  R.toPairs
)

// renderers

const renderScenario = scenario => {
  const lines = [
    titleColor(scenario.scenario)
  ]

  if (scenario.deadline) {
    lines[0] += ' '
    lines[0] += deadlineColor(scenario.deadline)
  }

  if (verbose) {
    lines.push(`${scenario.file}:${scenario.startLine}`)
    lines.push('')
  }

  if (scenario.comments.length > 0) {
    lines.concat(
      prependLines(scenario.comments.split('\n'))
    )
  }

  return lines
}

const renderScenarios = R.pipe(
  R.map(R.compose(prependLines, renderScenario)),
  R.flatten
)

const renderGroup = ([title, scenarios]) => ensurePadding([
  title,
  '',
  ...renderScenarios(scenarios)
])

const renderGroups = R.pipe(
  R.map(renderGroup),
  R.flatten
)

const printGroups = R.pipe(
  renderGroups,
  R.join('\n'),
  doIf(isNotEmpty, ::console.log)
)

// programm

const programm = R.pipeP(
  parseFeatures,
  getScenariosFromBlocks,
  getGroupsFromScenarios,
  printGroups
)

main(() => programm({defaultLanguage}))
