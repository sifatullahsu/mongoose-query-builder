import { TSelect } from '../types'

export const select: TSelect = (input, { select }) => {
  if (!input) return ''
  if (Array.isArray(input)) throw new Error('Multiple `select` found.')

  let isNegative: boolean = false

  const result = input
    .split(',')
    .map(element => element.trim())
    .filter(element => {
      if (element.startsWith('-') && element !== '-_id' && !isNegative) {
        isNegative = true
      }

      const selectInvalid = select.filter(x => x === element || element.startsWith(`${x}.`))
      const regexInvalid = /^$|\s|\+$|^-{2,}/.test(element)

      return !selectInvalid.length && !regexInvalid
    })

  const validation = isNegative ? ' ' + select.map(x => `-${x}`).join(' ') : ''
  return result.join(' ') + validation
}

/* =========
Regular Expression: /^$|\s|\+$|^-{2,}/
============
^$: Matches an empty string.
\s: Matches any whitespace character.
\+$: Matches a string that starts with a single '+'.
^-{2,}: Matches a string that starts with two or more consecutive '-' characters.
========= */
