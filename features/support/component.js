export function component(componentName) {
  function component(labels) {
    return Object.keys(labels || {})
      .map(function(key) {
        return byLabel(key, labels[key])
      })
      .concat([byComponent(componentName)])
      .join('')
  }

  component.element = function element(elementName) {
    return byElement(componentName + '-' + elementName)
  }

  return component
}

export function byComponent(name) {
  return '[data-test-component="' + name + '"]'
}

export function byElement(name) {
  return '[data-test-element="' + name + '"]'
}

export function byLabel(label, name) {
  return '[data-test-label-' + label + '="' + name + '"]'
}
