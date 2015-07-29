export function graphqlQuery(body) {
  return async (dispatch, getState) => {
    const headers = {
      'Content-Type': 'text/plain'
    }

    const token = getState().token

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
}
