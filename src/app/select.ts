import { TSelect } from '../types'
import { negativeSelect } from '../utils/negativeSelect'

export const select: TSelect = (input, { select }) => {
  if (!input) return negativeSelect(select)
  if (Array.isArray(input)) throw new Error('Multiple `select` found.')

  let isNegative: boolean = false

  const result = input
    .split(',')
    .map(element => element.trim())
    .filter(element => {
      const regexInvalid = new RegExp(/^$|\s|\+$|^-{2,}/).test(element)
      const selectInvalid = select.filter(x => new RegExp(`${x}|^${x}\\.|^-${x}`).test(element))

      if (
        element.startsWith('-') &&
        element !== '-_id' &&
        !regexInvalid &&
        !selectInvalid.length &&
        !isNegative
      ) {
        isNegative = true
      }

      return !selectInvalid.length && !regexInvalid
    })

  const resultValidation =
    result.length === 0
      ? negativeSelect(select)
      : result.length === 1 && result[0] === '-_id'
      ? `-_id ${negativeSelect(select)}`
      : isNegative
      ? `${result.join(' ')} ${negativeSelect(select)}`
      : result.join(' ')

  return resultValidation.trim()
}

/* =========
Regular Expression: /^$|\s|\+$|^-{2,}/
============
^$: Matches an empty string.
\s: Matches any whitespace character.
\+$: Matches a string that starts with a single '+'.
^-{2,}: Matches a string that starts with two or more consecutive '-' characters.
============
Regular Expression: `${x}|^${x}\\.|^-${x}`
============
${x}: Matches exact match of the string
^${x}\\.: Matches start with string ${x}.
^-${x}: Matches start with string -${x}
========= */
