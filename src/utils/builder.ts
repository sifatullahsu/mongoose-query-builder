/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAuthRules, User } from '../types'
import { valueValidator } from './valueValidator'

export const builder = (
  q: Record<string, any>[],
  authRules: TAuthRules,
  user: User
): Record<string, any>[] => {
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

      // callback
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

      const result = valueHandler({ key, value, rules, user, authRules })

      query.push({ [key]: result })
      return query
    },
    []
  )

  return result
}

const valueHandler = ({ key, value, rules, user, authRules }) => {
  const [, allowedOperators] = rules

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

    if (operator === '$not') {
      if (!Array.isArray(value)) {
        throw new Error(`Unauthorized format: array required for '${operator}' on '${key}'.`)
      }
      if (!value.length) {
        throw new Error(`Empty operation found for '${operator}' on '${key}'.`)
      }

      const result = valueHandler({ key, value, rules, user, authRules })

      initial[operator] = result
      return initial
    }

    if (operator === '$elemMatch') {
      if (!Array.isArray(value)) {
        throw new Error(`Unauthorized format: array required for '${operator}' on '${key}'.`)
      }
      if (!value.length) {
        throw new Error(`Empty operation found for '${operator}' on '${key}'.`)
      }

      const isValue = Array.isArray(value[0])

      if (isValue) {
        const result = valueHandler({ key, value, rules, user, authRules })

        initial[operator] = result
        return initial
      }

      const result = builder(value, authRules, user)
      const processedResult = result.reduce((prev, item) => {
        for (const key in item) {
          const newKey = key.split('.')[1]

          if (Object.prototype.hasOwnProperty.call(prev, newKey)) {
            throw new Error(`Multiple operations found on '${key}' in '${operator}'`)
          }

          prev[newKey] = item[key]
          return prev
        }
      }, {})

      initial[operator] = processedResult
      return initial
    }

    const isValidate = valueValidator({ key, operator, value, rules, user })

    if (!isValidate) {
      throw new Error(`Unauthorized value: '${operator}' on '${key}'`)
    }
    if (authRules.validator) {
      const result = authRules.validator({ key, operator, value, rules, user })
      if (typeof result !== 'boolean') {
        throw new Error(`Validator function should be return a 'boolean'`)
      }
      if (!result) {
        throw new Error(`Validator error: '${operator}' on '${key}'`)
      }
    }

    initial[operator] = value
    return initial
  }, {})

  return result
}

/* const [, allowedOperators] = rules

    const result = value.reduce((initial, item) => {
      if (!Array.isArray(item) || item.length !== 2) {
        throw new Error('Each operation should be a [key, value] pair.')
      }

      const [operator, value] = item

      if (!allowedOperators.includes(operator)) {
        throw new Error(`Unauthorized operation: '${operator}' on '${key}'`)
      }
      if (Object.prototype.hasOwnProperty.call(initial, key)) {
        throw new Error(`Multiple operations '${operator}' found on '${key}'`)
      }

      const isValidate = valueValidator({ key, operator, value, rules, user })

      if (!isValidate) {
        throw new Error(`Unauthorized value: '${operator}' on '${key}'`)
      }
      if (authRules.validator) {
        const result = authRules.validator({ key, operator, value, rules, user })
        if (typeof result !== 'boolean') {
          throw new Error(`Validator function should be return a 'boolean'`)
        }
        if (!result) {
          throw new Error(`Validator error: '${operator}' on '${key}'`)
        }
      }

      initial[operator] = value
      return initial
    }, {}) */
