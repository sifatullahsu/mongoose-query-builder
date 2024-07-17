import { z } from 'zod'
import { TValueValidator } from '../types'

export const valueValidator: TValueValidator = ({ key, operator, value, authRules, rules, user }) => {
  if (['$in', '$nin'].includes(operator)) {
    if (!Array.isArray(value)) {
      throw new Error(`Unauthorized value: 'array' required in '${operator}' on '${key}'`)
    }
    return
  }

  if (operator === '$size') {
    if (typeof value !== 'number') {
      throw new Error(`Unauthorized value: 'number' required in '${operator}' on '${key}'`)
    }
    return
  }

  if (operator === '$exists') {
    if (typeof value !== 'boolean') {
      throw new Error(`Unauthorized value: 'boolean' required in '${operator}' on '${key}'`)
    }
    return
  }

  if (operator === '$regex') {
    if (typeof value !== 'string') {
      throw new Error(`Unauthorized value: 'string' required in '${operator}' on '${key}'`)
    }
    return
  }

  if (operator === '$mod') {
    const isValid = z.array(z.number()).safeParse(value)
    if (!isValid.success) {
      throw new Error(`Unauthorized value: 'number[]' required in '${operator}' on '${key}'`)
    }
    return
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
}
