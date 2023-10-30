import { IQueryOperations } from '../types'

const valueMaker = (operation: IQueryOperations, value: string): unknown => {
  if (operation === ('$in' || '$nin' || '$all')) {
    return value.split(',')
  }

  if (operation === '$size') {
    if (!isNaN(Number(value))) return Number(value)
    else throw new Error('$size should be number')
  }

  if (operation === '$exists') {
    if (value === 'true') return true
    else if (value === 'false') return false
    else throw new Error('$exists should be true or false')
  }

  if (operation === '$regex') {
    const match = value.match(/^\/(.*?)\/([a-z]*)$/)

    if (match) {
      const pattern = match[1]
      const flags = match[2]

      return new RegExp(pattern, flags)
    } else {
      throw new Error('$exists: Invalid regex string')
    }
  }

  if (operation === '$mod') {
    return value.split(',').map(Number)
  }

  if (!isNaN(Number(value))) {
    return Number(value)
  }

  return value
}

export default valueMaker
