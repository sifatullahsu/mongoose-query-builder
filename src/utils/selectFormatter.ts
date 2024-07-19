import { TAuthRules } from '../types'

export const selectFormatter = (authRules: TAuthRules) => {
  return {
    pipe: authRules.select.join('|'),
    negativeReturn: authRules.select.length ? '-' + authRules.select.join(' -') : '',
    defaultReturn: authRules.defaultValue?.select ? authRules.defaultValue.select.join(' ') : ''
  }
}
