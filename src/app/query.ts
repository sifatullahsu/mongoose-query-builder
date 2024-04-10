import { Query, TQuery } from '../types'
import { authManager } from '../utils/authManager'
import { valueModifier } from '../utils/valueModifier'

export const query: TQuery = (q, user, { authentication, query }) => {
  const { auth, authQuery } = authManager(authentication, user)

  const $and: Query = authQuery ? [authQuery] : []

  query.forEach(([key, operations]) => {
    const validKey = q[key]

    if (validKey) {
      if (Array.isArray(auth) && auth.includes(key)) return

      for (const queryValue of Array.isArray(validKey) ? validKey : [validKey]) {
        const [type, value] = queryValue.split(':')

        if (!operations.includes(type)) {
          throw new Error(`Unauthorized: '${type}' on '${key}'`)
        }

        $and.push({ [key]: { [type]: valueModifier(type, value) } })
      }
    }
  })

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}
