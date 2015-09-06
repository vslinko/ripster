export function byComponent(name) {
  return '[data-test-component="' + name + '"]';
}

export function byElement(name) {
  return '[data-test-element="' + name + '"]';
}

export function byLabel(label, name) {
  return '[data-test-label-' + label + '="' + name + '"]';
}

export function chain(...selectors) {
  return selectors.join(' ');
}

export function component(componentName) {
  const c = (labels) => {
    return Object.keys(labels || {})
      .map((key) => {
        return byLabel(key, labels[key]);
      })
      .concat([byComponent(componentName)])
      .join('');
  };

  c.element = (elementName) => {
    return byElement(componentName + '-' + elementName);
  };

  return c;
}
