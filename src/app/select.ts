import { TSelect } from '../types'

export const select: TSelect = (input, { select }) => {
  if (!input) return ''
  if (Array.isArray(input)) throw new Error('Multiple `select` found.')

  const result = input
    .split(',')
    .map(element => element.trim())
    .filter(element => {
      return !select.includes(element) && element !== '' && !/\s/.test(element) && !element.includes('+')
    })

  return result.join(' ')
}
