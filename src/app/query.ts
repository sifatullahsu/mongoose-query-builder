import { Operations, Query, TQuery } from '../types'
import { authManager } from '../utils/authManager'
import { objectPicker } from '../utils/objectPicker'
import { valueModifier } from '../utils/valueModifier'

export const query: TQuery = (q, user, { authentication, permission }) => {
  const keys = permission.map(item => item[0])
  const elements = objectPicker(q, keys)
  const auth = authManager(authentication, user)

  const $and: Query = []

  for (const [key, values] of Object.entries(elements)) {
    for (const value of Array.isArray(values) ? values : [values]) {
      const [operationName, queryData] = (value as string).split(':')

      const [, allowedOperations] = permission.find(i => i[0] === key)!

      if (!allowedOperations.includes(operationName as Operations)) {
        throw new Error(`Unauthorized: '${operationName}' on '${key}'`)
      }

      const queryResult = {
        [key]: {
          [operationName]: valueModifier(operationName as Operations, queryData)
        }
      }

      if (auth === 'OPEN' || (Array.isArray(auth) && auth.length)) {
        $and.push(queryResult)

        if (Array.isArray(auth) && user) {
          const validateUser = auth.filter(
            x => !(key === x && queryData === user._id && operationName === '$eq')
          )

          if (validateUser.length) {
            $and.push(
              validateUser.length > 1
                ? { $or: validateUser.map(x => ({ [x]: { $eq: user._id } })) }
                : { [validateUser[0]]: { $eq: user._id } }
            )
          }
        }
      }
    }
  }

  if ($and.length === 0 && auth !== 'OPEN') {
    throw new Error('Unauthorized access')
  }

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}
