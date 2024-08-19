import { SelectFN } from '../types'
import { selectFormatter } from '../utils/selectFormatter'

export const select: SelectFN = function (input, user, key) {
  const rules = typeof key === 'string' ? this.get(key, 'strict').select : key

  const { pipe, protectedReturn, defaultReturn } = selectFormatter(user, rules)

  for (const i of rules.protected) {
    if (i.startsWith(' ') || i.endsWith(' ') || i.startsWith('+') || i.startsWith('-')) {
      throw new Error(`AuthRules: Invalid key '${i}' found in 'authRules.select'`)
    }
  }
  for (const i of rules.default) {
    if (i.startsWith(' ') || i.endsWith(' ') || i.startsWith('+') || i.startsWith('-')) {
      throw new Error(`AuthRules: Invalid key '${i}' found in 'authRules.defaultValue.select'`)
    }
    if (rules.protected.includes(i)) {
      throw new Error(`Duplicate key found: '${i}' in 'authRules.defaultValue.select'`)
    }
  }

  const added: string[] = []

  let isPositive: boolean = false
  let isNegative: boolean = false
  let isPositiveId: boolean = false
  let isNegativeId: boolean = false

  if (input.length) {
    if (rules.default && rules.default.length && input.length === 1 && input[0] === '*') {
      return protectedReturn
    }

    const result = input
      .reduce((prev, value) => {
        value = value.trim()

        if (new RegExp(`(^$|\\s|^\\+|^--)|((^|\\s)(-?(?:${pipe}))($|\\s))`).test(value)) {
          return prev
        }

        const item: { key: string; type: 'P' | 'N' } = value.startsWith('-')
          ? { key: value.slice(1), type: 'N' }
          : { key: value, type: 'P' }

        if (added.includes(item.key)) {
          throw new Error(`Multiple select '${item.key}' key found`)
        } else {
          added.push(item.key)
        }

        if (item.key !== '_id' && ((item.type === 'P' && isNegative) || (item.type === 'N' && isPositive))) {
          throw new Error('Positive Negative Both Found.')
        }

        if (item.key === '_id' && item.type === 'N' && !isNegativeId) isNegativeId = true
        else if (item.key === '_id' && item.type === 'P' && !isPositiveId) isPositiveId = true
        else if (item.type === 'N' && !isNegative) isNegative = true
        else if (item.type === 'P' && !isPositive) isPositive = true

        return `${prev} ${value}`
      }, '')
      .trim()

    if (!added.length) {
      return defaultReturn || protectedReturn
    }
    if (isPositive || isPositiveId) {
      return result
    }

    return `${result} ${protectedReturn}`.trim()
  }

  return defaultReturn || protectedReturn
}
