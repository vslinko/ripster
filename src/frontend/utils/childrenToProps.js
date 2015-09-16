import React from 'react';

function collectChildren(children) {
  const collection = [];

  React.Children.forEach(children, child =>
    collection.push(child)
  );

  return collection;
}

export default function childrenToProps(Component) {
  const componentName = Component.displayName || Component.name || '';

  return class ChildrenToProps extends React.Component {
    static displayName = `ChildrenToProps(${componentName})`

    render() {
      const childrenAsProps = collectChildren(this.props.children)
        .filter(child => child && child.key)
        .reduce((acc, child) => (
          acc[child.key] = child,
          acc
        ), {});

      const props = {
        ...this.props,
        ...childrenAsProps,
      };

      return (
        <Component {...props} />
      );
    }
  };
}
