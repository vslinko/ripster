import webdriverio from 'webdriverio'
import chai from 'chai'

const {assert} = chai
let browser

async function openUrl(url) {
  await browser.url(url)
}

async function waitFor(selector) {
  await browser.waitForExist(selector)
}

async function assertExists(selector) {
  const result = await browser.element(selector)

  assert.ok(result.value)
}

async function init() {
  browser = webdriverio.remote({
    desiredCapabilities: {
      browserName: process.env.BROWSER || 'chrome'
    },
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    waitforTimeout: Number(process.env.WAIT_FOR_TIMEOUT || '1000')
  })

  await browser.init()
}

async function shutdown() {
  await browser.end()
}

export function seleniumWorld(before, after) {
  before(init)
  after(shutdown)

  return {
    openUrl,
    waitFor,
    assertExists
  }
}
