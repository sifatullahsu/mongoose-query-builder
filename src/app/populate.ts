import { PopulateFN, QueryMaker } from '../types'

export const populate: PopulateFN = function (input, user, key) {
  const rules = typeof key === 'string' ? this.get(key, 'strict').populate : key

  const result = input.reduce((prev: QueryMaker['populate'], item) => {
    const innerRules = rules.find(i => i.path === item.path)

    if (innerRules && (!innerRules.roles || (user && innerRules.roles.includes(user.role)))) {
      const result = {
        path: item.path,
        select: this.select(item.select ?? [], user, innerRules.select ?? innerRules.ref),
        populate: this.populate(item.populate ?? [], user, innerRules.populate)
      }

      prev.push(result)
    }

    return prev
  }, [])

  return result
}
