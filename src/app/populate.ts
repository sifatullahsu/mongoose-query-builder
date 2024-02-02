import { Populate, TPopulate } from '../types'
import { select } from './select'

export const populate: TPopulate = (input, authorized) => {
  if (!input) return []
  else if (typeof input === 'string') input = [input]

  const output: Populate[] = []
  const stack: Populate[] = []

  for (const item of input) {
    const [key, value] = item.split(':')
    const currentPopulate = authorized.find(item => item[0] === key)

    if (currentPopulate) {
      const obj = {
        path: key,
        select: select(value, currentPopulate[1]),
        populate: []
      }

      // nested element
      const parentPath = key.split('.').slice(0, -1).join('.')
      const parent = stack.find(item => item.path === parentPath)
      if (parent) {
        parent.populate.push({ ...obj, path: key.split('.').slice(-1).join('') })
        stack.push(obj)
      }

      // top-level element || nested element but who does not have parent
      else {
        output.push(obj)
        stack.length = 0
        stack.push(obj)
      }
    }
  }

  return output
}
