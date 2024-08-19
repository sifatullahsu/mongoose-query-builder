import { Obj, QueryFN } from '../types'
import { authManager } from '../utils/authManager'
import { qBuilder } from '../utils/qBuilder'

export const query: QueryFN = function (input, user, key) {
  const rules = this.get(key, 'strict')

  const { authQuery } = authManager(rules.authentication, user)
  const output = qBuilder(input.query, user, rules)

  console.log(output, 'output')

  const $and: Obj[] = authQuery ? [authQuery] : []

  if (input.queryType === '$and') {
    $and.push(...output)
  } else {
    $and.push({ [input.queryType]: output })
  }

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}
