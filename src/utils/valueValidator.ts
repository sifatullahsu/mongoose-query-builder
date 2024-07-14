import { z } from 'zod'
import { TValidator } from '../types'

export const valueValidator: TValidator = ({ key, operator, value }) => {
  if (['$in', '$nin'].includes(operator)) {
    if (!Array.isArray(value)) {
      throw new Error(`Unauthorized value: 'array' required in '${operator}' on '${key}'`)
    }
    return true
  }

  if (operator === '$size') {
    if (typeof value !== 'number') {
      throw new Error(`Unauthorized value: 'number' required in '${operator}' on '${key}'`)
    }
    return true
  }

  if (operator === '$exists') {
    if (typeof value !== 'boolean') {
      throw new Error(`Unauthorized value: 'boolean' required in '${operator}' on '${key}'`)
    }
    return true
  }

  if (operator === '$regex') {
    if (typeof value !== 'string') {
      throw new Error(`Unauthorized value: 'string' required in '${operator}' on '${key}'`)
    }
    return true
  }

  if (operator === '$mod') {
    const isValid = z.array(z.number()).safeParse(value)
    if (!isValid.success) {
      throw new Error(`Unauthorized value: 'number[]' required in '${operator}' on '${key}'`)
    }
    return true
  }

  return true
}
