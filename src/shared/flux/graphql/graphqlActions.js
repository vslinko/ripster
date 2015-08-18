export function graphqlQuery(body) {
  return async (dispatch, getState) => {
    const headers = {
      'Content-Type': 'application/graphql'
    }

    const token = getState().token

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = process.env.GRAPHQL_URL || '/graphql'

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
}
