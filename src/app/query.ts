import { Query, TQuery } from '../types'
import { authManager } from '../utils/authManager'
import { builder } from '../utils/builder'

export const query: TQuery = (q, user, authRules) => {
  const { authQuery } = authManager(authRules.authentication, user)
  const output = builder(q.query as Query[], user, authRules)

  const $and: Query[] = authQuery ? [authQuery] : []

  if (q.queryType === '$and') {
    $and.push(...output)
  } else {
    $and.push({ [q.queryType as string]: output })
  }

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}
