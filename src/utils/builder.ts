/* eslint-disable @typescript-eslint/no-explicit-any */
import { TBuilder } from '../types'
import { valueHandler } from './valueHandler'

type TRecord = Record<string, any>

export const builder: TBuilder = (q, user, authRules) => {
  const result = q.reduce((query: TRecord[], element: TRecord): TRecord[] => {
    const keys = Object.keys(element)
    const key = keys[0]
    const value = element[key]

    if (keys.length !== 1) {
      throw new Error('Each block should contain a single operation.')
    }
    if (!Array.isArray(value)) {
      throw new Error(`Unauthorized format: array required in '${key}'.`)
    }

    if (['$and', '$or', '$nor'].includes(key)) {
      if (authRules.queryType) {
        let disabled = authRules.queryType.disabled

        if (user && authRules.queryType.additional && authRules.queryType.additional.length) {
          const result = authRules.queryType.additional.find(i => i.roles.includes(user.role))

          if (result) {
            disabled = result.disabled
          }
        }

        if (disabled.includes(key as '$or' | '$nor')) {
          throw new Error(`The '${key}' operator has been disabled.`)
        }
      }
      if (!value.length) {
        throw new Error(`Empty operation found for key: '${key}'`)
      }

      const result = builder(value, user, authRules)

      query.push({ [key]: result })
      return query
    }

    const rules = authRules.query.find(i => i[0] === key)

    if (!rules) {
      throw new Error(`Unauthorized access: '${key}'.`)
    }

    const result = valueHandler({ value, rules, user, authRules })

    query.push({ [key]: result })
    return query
  }, [])

  return result
}
