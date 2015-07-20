#!/usr/bin/env babel-node

/* eslint-disable max-statements */

import glob from 'glob'
import path from 'path'
import fs from 'fs'

const prefix = {
  'en': 'And',
  'ru': 'И'
}

function *scrapBlocks(content) {
  let inBlock = false
  let block = []
  let blockLines = 0
  let functional
  let language = 'en'
  let stage = 'stage1'

  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const fnMatches = /^#\s*([^:]+:\s*[^\n]+)$/gm.exec(line)
    const languageMatches = /^#\s*language:\s*(.+)$/.exec(line)
    const stageMatches = /^#\s*(stage\d+)$/.exec(line)

    if (line.trim() === '') {
      continue
    } else if (languageMatches && inBlock) {
      language = languageMatches[1]
    } else if (stageMatches && inBlock) {
      stage = stageMatches[1]
    } else if (fnMatches && !inBlock) {
      functional = fnMatches[1].trim()

    } else if (line === '```feature' && functional) {
      inBlock = true

    } else if (line === '```' && inBlock) {
      if (blockLines > 1) {
        yield {
          language,
          stage,
          functional,
          content: block.join('\n')
        }
      }

      block = []
      blockLines = 0
      inBlock = false

    } else if (inBlock) {
      if (/^\s*#/.test(line) || /^\s*[^:]+:/.test(line)) {
        block.push(line)
      } else {
        blockLines++
        block.push(line.replace(/^([ ]*)/, `$1${prefix[language]} `))
      }
    }
  }
}

function main() {
  const rootDir = path.join(__dirname, '..')
  const srcDir = path.join(rootDir, 'planned-features')
  const distDir = path.join(rootDir, 'features-dist')

  for (const file of glob.sync(path.join(distDir, '**', '*.feature'))) {
    fs.unlinkSync(file)
  }

  const blocks = []

  for (const markdownFile of glob.sync(path.join(srcDir, '**', '*.md'))) {
    const content = fs.readFileSync(markdownFile).toString()

    for (const block of scrapBlocks(content)) {
      blocks.push({...block, file: markdownFile})
    }
  }

  blocks
    .filter(block => block.stage === 'stage3')
    .forEach((block, index) => {
      const resultFile = path.join(distDir, `${index}.feature`)
      const content = [
        `# original file: ${block.file}`,
        `# language: ${block.language}`,
        block.functional,
        block.content,
        ''
      ].join('\n')

      fs.writeFileSync(resultFile, content)
    })
}

main()
