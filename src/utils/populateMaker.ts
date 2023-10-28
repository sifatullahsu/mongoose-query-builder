import { IPopulate } from '../types'
import selectMaker from './selectMaker'

const populateMaker = (input: string | string[], authorizedPopulate: [string, string[]][]): IPopulate[] => {
  if (!input) return []
  else if (typeof input === 'string') input = [input]

  const output: IPopulate[] = []
  const stack: IPopulate[] = []

  for (const item of input) {
    const [key, value] = item.split(':')
    const currentPopulate = authorizedPopulate.find(item => item[0] === key)

    if (currentPopulate) {
      const obj = {
        path: key,
        select: selectMaker(value, currentPopulate[1]),
        populate: []
      }

      // for nested element
      const parentPath = key.split('.').slice(0, -1).join('.')
      const parent = stack.find(item => item.path === parentPath)
      if (parent) {
        parent.populate.push({ ...obj, path: key.split('.').slice(-1).join('') })
        stack.push(obj)
      }

      // for top-level element ||
      // for nested element but who does not have parent - treat as a (top-level element)
      else {
        output.push(obj)
        stack.length = 0
        stack.push(obj)
      }
    }
  }

  return output
}

export default populateMaker
