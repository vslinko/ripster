import jsdom from 'jsdom';

const cache = {};

export default function createHeadlessBrowser(testOptions) {
  const cookieJar = jsdom.createCookieJar();
  let currentUrl;
  let currentWindow;

  const options = testOptions || {};
  const systemLanguage = options.systemLanguage || 'en';
  const proxyConsole = options.proxyConsole || false;

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const waitForTimeout = Number(process.env.WAIT_FOR_TIMEOUT || '5000');

  function openUrl(url) {
    currentUrl = url;

    return new Promise((resolve, reject) => {
      jsdom.env({
        url: baseUrl + url,
        cookieJar,
        virtualConsole: proxyConsole && jsdom.createVirtualConsole().sendTo(console),
        headers: {
          'Accept-Language': systemLanguage,
        },
        features: {
          FetchExternalResources: ['script', 'link'],
          ProcessExternalResources: ['script'],
          SkipExternalResources: /maps\.googleapis\.com/,
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
        created: (err, window) => {
          if (!window) {
            return;
          }

          window.navigator.languages = [systemLanguage];

          if (!window.localStorage) {
            window.localStorage = {
              _storage: Object.create(null),
              setItem(key, value) {
                this._storage[key] = String(value);
              },
              getItem(key) {
                return this._storage[key];
              },
            };
          }

          if (!window.sessionStorage) {
            window.sessionStorage = {
              _storage: Object.create(null),
              setItem(key, value) {
                this._storage[key] = String(value);
              },
              getItem(key) {
                return this._storage[key];
              },
            };
          }
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

  function asyncGet(getter, timeoutMessage) {
    return new Promise((resolve, reject) => {
      let timeout;
      let interval;

      timeout = setTimeout(() => {
        clearInterval(interval);
        reject(new Error(timeoutMessage()));
      }, waitForTimeout);

      interval = setInterval(() => {
        try {
          const result = getter();

          if (result) {
            clearTimeout(timeout);
            clearInterval(interval);
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      }, 50);
    });
  }

  function querySelectorAll(selector) {
    return currentWindow.document.querySelectorAll(selector);
  }

  function querySelector(selector) {
    return currentWindow.document.querySelector(selector);
  }

  function asyncQuerySelectorAll(selector, context = currentWindow.document) {
    return asyncGet(
      () => {
        const nodes = context.querySelectorAll(selector);

        if (nodes.length > 0) {
          return nodes;
        }

        return false;
      },
      () => `element (${selector}) still not existing after ${waitForTimeout}ms`
    );
  }

  function asyncQuerySelector(selector, context = currentWindow.document) {
    return asyncQuerySelectorAll(selector, context)
      .then(result => result[0]);
  }

  function waitFor(test, timeoutMessage) {
    return asyncGet(test, timeoutMessage || 'Timeout')
      .then(() => undefined);
  }

  function waitForSelector(selector) {
    return waitFor(
      () => currentWindow.document.querySelectorAll(selector).length > 0,
      () => `element (${selector}) still not existing after ${waitForTimeout}ms`
    );
  }

  function fillNode(node, text) {
    currentWindow.TestUtils.Simulate.change(node, {
      target: {
        value: text,
      },
    });
  }

  function fill(selector, text) {
    const node = currentWindow.document.querySelector(selector);

    if (!node) {
      throw new Error(`Unable to fill (${selector})`);
    }

    fillNode(node, text);
  }

  function submitNode(node) {
    currentWindow.TestUtils.Simulate.submit(node);
  }

  function submit(selector) {
    const node = currentWindow.document.querySelector(selector);

    if (!node) {
      throw new Error(`Unable to submit (${selector})`);
    }

    submitNode(node);
  }

  function clickNode(node) {
    currentWindow.TestUtils.Simulate.click(node);
  }

  function click(selector) {
    const node = currentWindow.document.querySelector(selector);

    if (!node) {
      throw new Error(`Unable to click (${selector})`);
    }

    clickNode(node);
  }

  function reload() {
    return openUrl(currentUrl);
  }

  function dump() {
    return jsdom.serializeDocument(currentWindow.document);
  }

  function getWindow() {
    return currentWindow;
  }

  function tick() {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }

  function nodeIsVisible(node) {
    let nextNode = node;

    do {
      if (currentWindow.getComputedStyle(nextNode).getPropertyValue('display') === 'none') {
        return false;
      }

      nextNode = nextNode.parentNode;
    } while (nextNode && nextNode !== currentWindow.document);

    return true;
  }

  return {
    openUrl,
    querySelectorAll,
    querySelector,
    asyncQuerySelectorAll,
    asyncQuerySelector,
    waitFor,
    waitForSelector,
    fillNode,
    fill,
    submitNode,
    submit,
    clickNode,
    click,
    reload,
    dump,
    getWindow,
    tick,
    nodeIsVisible,
  };
}
