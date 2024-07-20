import { AuthRules } from '../schema'
import { Populate, TPopulate } from '../types'
import { select } from './select'

export const populate: TPopulate = (input = [], authRules) => {
  if (!input.length) return []

  const output: Populate[] = []
  const stack: Populate[] = []

  for (const item of input) {
    const [key, value] = item
    const currentPopulate = authRules.populate.find(item => item[0] === key)

    if (currentPopulate) {
      const obj = {
        path: key,
        select: select(value, {
          ...authRules,
          select: currentPopulate[1],
          defaultValue: {
            ...authRules.defaultValue,
            select: currentPopulate[2]
          }
        }),
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

const input: [string, string[]][] = [
  ['mentor', ['password']],
  ['category', ['title']],
  ['user', []],
  ['topics', []],
  ['topics.category', []]
]

const profileAuthRules: AuthRules = {
  authentication: 'OPEN',
  query: [],
  select: ['nid', 'address'],
  populate: [
    ['mentor', ['password'], ['_id']],
    ['category', [], ['_id']],
    ['topics.category', [], []],
    ['topics', [], []]
  ],
  validator: () => true,
  defaultValue: {
    populate: ['user'],
    select: ['_id']
  }
}

const result = populate(input, profileAuthRules)

console.log(JSON.stringify(result, null, 2))

const pi = {
  path: 'category',
  select: [[], []],
  populate: []
}
