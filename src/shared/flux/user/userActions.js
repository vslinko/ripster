import {graphqlMutation, executeQueries} from '../graphql/graphqlActions'
import {setToken} from '../token/tokenActions'

export function authorize(email, password) {
  return async (dispatch) => {
    const result = await dispatch(graphqlMutation(`
      mutation CreateSession {
        createSession(email: "${email}", password: "${password}") {
          sid
        }
      }
    `))

    dispatch(setToken(result.createSession.sid))

    await dispatch(executeQueries())
  }
}
