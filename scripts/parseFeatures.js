import {basename} from 'path'
import {last} from 'ramda'
import {join} from 'path'
import {readFileAsync} from 'fs-extra-promise'
import crypto from 'crypto'
import keywords from 'gherkin/lib/gherkin/gherkin-languages.json'
import {rootDir, glob} from './utils'

/* eslint-disable max-statements */
function *scrapBlocks(content, {defaultLanguage}) {
  let inBlock = false
  let block = []
  let blockLines = 0
  let functional = '<Undefined Functional>'
  let language
  let stage
  let priority
  let comments
  let deadline
  let startLine

  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const fnMatches = /^#\s*([^#:][^:]*:\s*[^\n]+)$/.exec(line)
    const languageMatches = /^#\s*language:\s*(.+)$/.exec(line)
    const deadlineMatches = /^#\s*deadline:\s*(.+)$/.exec(line)
    const stageMatches = /^#\s*stage\s*(\d+)$/.exec(line)
    const priorityMatches = /^#\s*(\d+)$/.exec(line)

    if (line.trim() === '') {
      continue
    } else if (languageMatches && inBlock) {
      language = languageMatches[1]
    } else if (deadlineMatches && inBlock) {
      deadline = deadlineMatches[1].trim()
    } else if (stageMatches && inBlock) {
      stage = Number(stageMatches[1])
    } else if (priorityMatches && inBlock) {
      priority = Number(priorityMatches[1])
    } else if (fnMatches && !inBlock) {
      functional = fnMatches[1].trim()

    } else if (line === '```feature') {
      inBlock = true
      language = defaultLanguage || 'en'
      stage = 0
      priority = undefined
      comments = []
      deadline = undefined
      startLine = i + 1

    } else if (line === '```' && inBlock) {
      if (blockLines > 1) {
        yield {
          language,
          stage,
          functional,
          priority,
          deadline,
          startLine,
          endLine: i + 1,
          comments: comments.join('\n'),
          content: block.join('\n')
        }
      }

      block = []
      blockLines = 0
      inBlock = false

    } else if (inBlock) {
      if (/^\s*#/.test(line)) {
        comments.push(line)
      } else if (/^\s*[^:]+:/.test(line)) {
        block.push(line)
      } else {
        blockLines++
        block.push(
          line.replace(
            /^([ ]*)/,
            `$1${last(keywords[language].and).trim()} `
          )
        )
      }
    }
  }
}
/* eslint-enable max-statements */

export async function parseFeatures({defaultLanguage} = {}) {
  const files = await glob(join(rootDir, 'planned-features', '**', '*.md'))
  const blocks = []

  for (const file of files) {
    const content = (await readFileAsync(file)).toString()

    for (const block of scrapBlocks(content, {defaultLanguage})) {
      blocks.push({
        ...block,
        file: file.replace(rootDir + '/', '')
      })
    }
  }

  return blocks
}

export function blockUniqueName(block) {
  const hash = crypto
    .createHash('sha1')
    .update(JSON.stringify(block))
    .digest('hex')

  const name = [
    10 - block.stage,
    block.stage,
    block.priority,
    block.language,
    basename(block.file, '.md'),
    block.startLine,
    hash
  ].join('-') + '.feature'

  return name
}
