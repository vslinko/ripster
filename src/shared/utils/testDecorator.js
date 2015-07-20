import React from 'react'
import {findDOMNode} from 'react-dom'

export default function testDecorator(labelsConstructor) {
  return Component => {
    const id = Component.displayName || Component.name

    if (!id) {
      throw new Error()
    }

    function markTestElement(name) {
      return {
        'data-test-element': `${id}-${name}`
      }
    }

    return class TestComponent {
      componentDidMount() {
        const labels = labelsConstructor
          ? labelsConstructor(this.props)
          : {}

        const componentNode = findDOMNode(this)

        Object.keys(labels)
          .map((key) => {
            const value = labels[key]
            const labelName = key[0].toUpperCase() + key.slice(1)

            return {
              key: `testLabel${labelName}`,
              value
            }
          })
          .concat([{
            key: 'testComponent',
            value: id
          }])
          .reduce((componentNode, {key, value}) => (
            componentNode.dataset[key] = value,
            componentNode
          ), componentNode)
      }

      render() {
        return (
          <Component
            {...this.props}
            e={markTestElement}
          />
        )
      }
    }
  }
}
