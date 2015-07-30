import jsdom from 'jsdom'
import chai from 'chai'

const {assert} = chai
const cookieJar = jsdom.createCookieJar()
let currentWindow

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const waitForTimeout = Number(process.env.WAIT_FOR_TIMEOUT || '1000')
const cache = {}

function openUrl(url) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      url: baseUrl + url,
      cookieJar,
      virtualConsole: jsdom.createVirtualConsole().sendTo(console),
      features: {
        FetchExternalResources: ['script', 'css'],
        ProcessExternalResources: ['script']
      },
      resourceLoader: (resource, callback) => {
        if (cache[resource.url.href]) {
          return callback(undefined, cache[resource.url.href])
        }

        resource.defaultFetch((err, result) => {
          if (err) {
            return callback(err)
          }

          cache[resource.url.href] = result
          callback(undefined, result)
        })
      },
      done: (err, window) => {
        currentWindow = window

        if (err) {
          reject(err[0])
        } else {
          resolve()
        }
      }
    })
  })
}

function waitFor(selector) {
  return new Promise((resolve, reject) => {
    let timeout
    let interval

    timeout = setTimeout(() => {
      clearInterval(interval)
      reject(new Error('Timeout error'))
    }, waitForTimeout)

    interval = setInterval(() => {
      const result = currentWindow.document.querySelectorAll(selector)

      if (result.length > 0) {
        clearTimeout(timeout)
        resolve()
      }
    }, 50)
  })
}

function assertExists(selector) {
  const result = currentWindow.document.querySelectorAll(selector)

  assert.isAbove(result.length, 0)
}

export function jsdomWorld() {
  return {
    openUrl,
    waitFor,
    assertExists
  }
}
