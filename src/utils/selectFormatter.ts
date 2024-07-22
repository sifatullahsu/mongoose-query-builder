import { SelectFormatterFN } from '../types'

export const selectFormatter: SelectFormatterFN = (user, rules) => {
  let p = rules.protected
  let d = rules.default

  if (user && rules?.additional && rules.additional.length) {
    const result = rules.additional.find(i => i.roles.includes(user.role))

    if (result) {
      p = result.protected
      d = result.default
    }
  }

  return {
    pipe: p.join('|'),
    protectedReturn: p.length ? '-' + p.join(' -') : '',
    defaultReturn: d.join(' ')
  }
}
