import { TAuthRules } from '../types'

export const selectFormatter = (rules: TAuthRules['select']) => {
  return {
    pipe: rules[0].join('|'),
    negativeReturn: rules[0].length ? '-' + rules[0].join(' -') : '',
    defaultReturn: rules[1].length ? rules[1].join(' ') : ''
  }
}
