import { TAuthRules } from '../types'

export const selectFormatter = (authRules: TAuthRules) => {
  return {
    pipe: authRules.select[0].join('|'),
    negativeReturn: authRules.select[0].length ? '-' + authRules.select[0].join(' -') : '',
    defaultReturn: authRules.select[1].length ? authRules.select[1].join(' ') : ''
  }
}
