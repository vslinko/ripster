import React from 'react'
import {connect} from 'react-redux'
import {addQuery, removeQuery} from '../flux/graphql/graphqlActions'

function isRealQuery(query) {
  return /^\s*(query|\{)/.test(query)
}

export default function queries(queries) {
  return Component => {

    @connect(state => ({
      _graphql: state.graphql.data
    }))
    class Queries {
      componentWillMount() {
        Object.keys(queries)
          .forEach(key => {
            const query = queries[key]

            if (isRealQuery(query)) {
              this.props.dispatch(addQuery(query))
            }
          })
      }

      componentWillUnmount() {
        Object.keys(queries)
          .forEach(key => {
            const query = queries[key]

            if (isRealQuery(query)) {
              this.props.dispatch(removeQuery(query))
            }
          })
      }

      render() {
        const {_graphql, ...props} = this.props

        const queryProps = Object.keys(queries)
          .reduce((acc, key) => {
            const query = queries[key]

            if (isRealQuery(query)) {
              if (_graphql[query] && key in _graphql[query]) {
                acc[key] = _graphql[query][key]
              } else {
                acc[key] = _graphql[query]
              }
            }

            return acc
          }, {})

        return <Component {...props} {...queryProps} />
      }
    }

    Queries.queries = queries

    return Queries
  }
}
