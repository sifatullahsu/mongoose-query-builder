import { Obj, QBuilderFN } from '../types'
import { qHandler } from './qHandler'

export const qBuilder: QBuilderFN = (q, user, authRules) => {
  const result = q.reduce((query: Obj[], element) => {
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

      const result = qBuilder(value, user, authRules)

      query.push({ [key]: result })
      return query
    }

    let rules = authRules.query.fields.find(i => i[0] === key)

    if (user && authRules.query.additional && authRules.query.additional.length) {
      const result = authRules.query.additional.find(i => i.roles.includes(user.role))

      if (result) {
        const isAvailable = result.fields.find(i => i[0] === key)

        if (isAvailable) {
          rules = isAvailable
        }
      }
    }

    if (!rules) {
      throw new Error(`Unauthorized access: '${key}'.`)
    }

    const result = qHandler(value, rules, user, authRules)

    query.push({ [key]: result })
    return query
  }, [])

  return result
}
