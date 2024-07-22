import { PopulateFN, QueryMaker } from '../types'
import { select } from './select'

export const populate: PopulateFN = (input, user, populateRules) => {
  const result = input.reduce((prev: QueryMaker['populate'], item) => {
    const rules = populateRules.find(i => i.path === item.path)

    if (rules && (!rules.roles || (user && rules.roles.includes(user.role)))) {
      const result = {
        path: item.path,
        select: select(item.select ?? [], user, rules.select),
        populate: populate(item.populate ?? [], user, rules.populate)
      }

      prev.push(result)
    }

    return prev
  }, [])

  return result
}
