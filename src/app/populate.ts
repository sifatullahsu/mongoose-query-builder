import { PopulateV4, TPopulate } from '../types'
import { select } from './select'

export const populate: TPopulate = (input, populateRules) => {
  const result = input.reduce((prev: PopulateV4[], item) => {
    const rules = populateRules.find(i => i.path === item.path)

    if (rules) {
      const result = {
        path: item.path,
        select: select(item.select ?? [], rules.select),
        populate: populate(item.populate ?? [], rules.populate)
      }

      prev.push(result)
    }

    return prev
  }, [])

  return result
}
