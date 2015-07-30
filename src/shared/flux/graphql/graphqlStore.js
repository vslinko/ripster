import createStore from '../../utils/createStore'

import {
  GRAPHQL_QUERY_DATA,
  GRAPHQL_ADD_QUERY,
  GRAPHQL_REMOVE_QUERY
} from './graphqlConstants'

const initialState = {
  data: {},
  queries: {}
}

export default createStore(initialState, {
  [GRAPHQL_QUERY_DATA]: (state, {query, data}) => {
    return {
      ...state,
      data: {
        ...state.data,
        [query]: data
      }
    }
  },

  [GRAPHQL_ADD_QUERY]: (state, {query}) => {
    const number = state.queries[query]
      ? state.queries[query] + 1
      : 1

    return {
      ...state,
      queries: {
        ...state.queries,
        [query]: number
      }
    }
  },

  [GRAPHQL_REMOVE_QUERY]: (state, {query}) => {
    return {
      ...state,
      queries: {
        ...state.queries,
        [query]: state.queries[query] - 1
      }
    }
  }
})
