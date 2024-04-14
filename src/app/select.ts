import { TSelect } from '../types'
import { selectFormatter } from '../utils/selectFormatter'

export const select: TSelect = (input, { select }) => {
  if (Array.isArray(input)) throw new Error('Multiple `select` found.')

  const { negative, pipe } = selectFormatter(select)

  let isNegative: boolean = false

  const result = input.split(',').reduce((prev, value) => {
    value = value.trim()

    if (new RegExp(`(^$|\\s|^\\+|^--)|((^|\\s)(-?(?:${pipe}))($|\\s))`).test(value)) {
      return prev
    }

    if (value.startsWith('-') && value !== '-_id' && !isNegative) {
      isNegative = true
    }

    return `${prev} ${value}`
  }, '')

  return `${result} ${isNegative ? negative : ''}`.trim()
}
