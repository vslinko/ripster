import jsdom from 'jsdom';

let cookieJar;
let currentWindow;
let cache;

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const waitForTimeout = Number(process.env.WAIT_FOR_TIMEOUT || '1000');

function openUrl(world, url) {
  world.url = url;

  if (world.sessionId) {
    cookieJar.setCookieSync(`token=${world.sessionId}`, baseUrl);
  }

  return new Promise((resolve, reject) => {
    jsdom.env({
      url: baseUrl + url,
      cookieJar,
      virtualConsole: jsdom.createVirtualConsole().sendTo(console),
      headers: {
        'Accept-Language': world.systemLanguage || 'ru',
      },
      features: {
        FetchExternalResources: ['script', 'css'],
        ProcessExternalResources: ['script'],
      },
      resourceLoader: (resource, callback) => {
        if (cache[resource.url.href]) {
          return callback(undefined, cache[resource.url.href]);
        }

        resource.defaultFetch((err, result) => {
          if (err) {
            return callback(err);
          }

          cache[resource.url.href] = result;
          callback(undefined, result);
        });
      },
      done: (err, window) => {
        currentWindow = window;

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    });
  });
}

function assertEventually(test, errorMessage) {
  return new Promise((resolve, reject) => {
    let timeout;
    let interval;

    timeout = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(errorMessage()));
    }, waitForTimeout);

    interval = setInterval(() => {
      if (test()) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

function assertEventuallyExists(world, selector) {
  return assertEventually(
    () => {
      return currentWindow.document.querySelectorAll(selector).length > 0;
    },
    () => {
      const visible = Array.prototype.slice
        .call(currentWindow.document.querySelectorAll('[data-test-component]'))
        .map(node => node.getAttribute('data-test-component'))
        .join(', ');

      return `element (${selector}) still not existing after ${waitForTimeout}ms, existing components: ${visible}`;
    }
  );
}

function click(world, selector) {
  currentWindow.document.querySelector(selector).click();
}

function reload(world) {
  return world.openUrl(world.url);
}

export function browserWorld({beforeEach}) {
  beforeEach(() => {
    cookieJar = jsdom.createCookieJar();
    cache = {};
  });

  return () => {
    return {
      openUrl,
      assertEventuallyExists,
      click,
      reload,
    };
  };
}
