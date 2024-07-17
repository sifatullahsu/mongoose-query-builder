/* eslint-disable @typescript-eslint/no-explicit-any */
import { TBuilder, TValueHandler } from '../types'
import { valueValidator } from './valueValidator'

export const builder: TBuilder = (q, authRules, user) => {
  const result = q.reduce(
    (query: Record<string, any>[], element: Record<string, any>): Record<string, any>[] => {
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
        if (!value.length) {
          throw new Error(`Empty operation found for key: '${key}'`)
        }

        const result = builder(value, authRules, user)

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
    },
    []
  )

  return result
}

const valueHandler: TValueHandler = ({ value, rules, user, authRules }) => {
  const [key, allowedOperators] = rules

  const result = value.reduce((initial, item) => {
    if (!Array.isArray(item) || item.length !== 2) {
      throw new Error('Each operation should be a [key, value] pair.')
    }

    const [operator, value] = item

    if (!allowedOperators.includes(operator)) {
      throw new Error(`Unauthorized operation: '${operator}' on '${key}'`)
    }
    if (Object.prototype.hasOwnProperty.call(initial, operator)) {
      throw new Error(`Multiple operations '${operator}' found on '${key}'`)
    }

    if (['$not', '$elemMatch'].includes(operator)) {
      if (!Array.isArray(value)) {
        throw new Error(`Unauthorized format: array required for '${operator}' on '${key}'.`)
      }
      if (!value.length) {
        throw new Error(`Empty operation found for '${operator}' on '${key}'.`)
      }
      if (operator === '$elemMatch' && !Array.isArray(value[0])) {
        const result = builder(value, authRules, user).reduce((prev, item) => {
          for (const key in item) {
            const _key = key.split('.')[1]

            if (Object.prototype.hasOwnProperty.call(prev, _key)) {
              throw new Error(`Multiple operations found on '${key}' in '${operator}'`)
            }

            prev[_key] = item[key]
          }
          return prev
        }, {})

        initial[operator] = result
        return initial
      }

      const result = valueHandler({ value, rules, user, authRules })

      initial[operator] = result
      return initial
    }

    valueValidator({ key, operator, value, rules, user, authRules })

    initial[operator] = value
    return initial
  }, {})

  return result
}
