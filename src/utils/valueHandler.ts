import { TValueHandler } from '../types'
import { builder } from './builder'
import { valueValidator } from './valueValidator'

export const valueHandler: TValueHandler = ({ value, rules, user, authRules }) => {
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
