import { Operations, Query, TQuery } from '../types'
import { objectPicker } from '../utils/objectPicker'
import { valueModifier } from '../utils/valueModifier'

export const query: TQuery = (q, user, authorized) => {
  const keys = authorized.filter.map(item => item[0])
  const elements = objectPicker(q, keys)

  const { all, filter } = authorized

  const $and: Query = []

  for (const [key, values] of Object.entries(elements)) {
    for (const value of Array.isArray(values) ? values : [values]) {
      const [operationName, queryData] = (value as string).split(':')

      const query = filter.find(i => i[0] === key)

      if (!query) break
      if (!query[1].includes(operationName as Operations)) {
        throw new Error(`Unauthorized: '${operationName}' on '${key}'`)
      }

      const queryResult = {
        [key]: {
          [operationName]: valueModifier(operationName as Operations, queryData)
        }
      }

      // Authentication rules
      if (query[2] === 'OPEN') {
        $and.push(queryResult)
      } else if (!user) {
        throw new Error(`Unauthorized: 'required_registered_user' on '${key}'`)
      } else if (Array.isArray(query[2])) {
        const authInfo = query[2].find(x => x[0].includes(user.role))

        if (!authInfo) throw new Error(`Unauthorized: 'user_role_access' on '${key}'`)

        $and.push(queryResult)

        if (Array.isArray(authInfo[1])) {
          const newAuthInfo = authInfo[1].filter(
            x => !(key === x && queryData === user._id && operationName === '$eq')
          )

          if (newAuthInfo.length) {
            $and.push(
              newAuthInfo.length > 1
                ? { $or: newAuthInfo.map(x => ({ [x]: { $eq: user._id } })) }
                : { [newAuthInfo[0]]: { $eq: user._id } }
            )
          }
        }
      }
    }
  }

  if ($and.length === 0 && all !== 'OPEN') {
    if (!all.find(i => i === user?.role)) throw new Error('Unauthorized access')
  }

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}
