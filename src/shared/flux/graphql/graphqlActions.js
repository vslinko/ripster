import {
  GRAPHQL_QUERY_DATA,
  GRAPHQL_ADD_QUERY,
  GRAPHQL_REMOVE_QUERY
} from './graphqlConstants'

export function setQueryData(query, data) {
  return {
    type: GRAPHQL_QUERY_DATA,
    query,
    data
  }
}

export function addQuery(query) {
  return {
    type: GRAPHQL_ADD_QUERY,
    query
  }
}

export function removeQuery(query) {
  return {
    type: GRAPHQL_REMOVE_QUERY,
    query
  }
}

async function graphqlRequest(body, token) {
  const headers = {
    'Content-Type': 'text/plain'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = process.env.GRAPHQL_URL || '/_graphql'

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  })

  const json = await response.json()

  if (json.errors) {
    const messages = json.errors
      .map(error => `"${error.message}"`)
      .join(' ')

    throw new Error(`GraphQL Errors: ${messages}`)
  }

  return json.data
}

export function graphqlQuery(body) {
  return async (dispatch, getState) => {
    const data = await graphqlRequest(body, getState().token)

    await dispatch(setQueryData(body, data))

    return data
  }
}

export function graphqlMutation(body) {
  return (dispatch, getState) => {
    return graphqlRequest(body, getState().token)
  }
}

export function executeQueries() {
  return async (dispatch, getState) => {
    const queries = getState().graphql.queries

    await* Object.keys(queries)
      .map(query => {
        if (queries[query] > 0) {
          return dispatch(graphqlQuery(query))
        }
      })
  }
}
