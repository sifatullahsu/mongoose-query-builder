import { Obj, QueryFN } from '../types'
import { authManager } from '../utils/authManager'
import { qBuilder } from '../utils/qBuilder'

export const query: QueryFN = (input, user, authRules) => {
  const { authQuery } = authManager(authRules.authentication, user)
  const output = qBuilder(input.query, user, authRules)

  const $and: Obj[] = authQuery ? [authQuery] : []

  if (input.queryType === '$and') {
    $and.push(...output)
  } else {
    $and.push({ [input.queryType]: output })
  }

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}
