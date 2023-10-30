const selectMaker = (input: string | string[], authorizedSelect: string[]): string => {
  if (!input) return ''
  if (Array.isArray(input)) throw new Error('Multiple select found.')

  const inputArray = input.split(',')
  const result = inputArray.filter((element: string) => {
    const trimmedElement = element.trim()
    // Exclude elements that are not in authorizedSelect and do not contain spaces or empty strings
    return (
      !authorizedSelect.includes(trimmedElement) &&
      trimmedElement !== '' &&
      !/\s/.test(trimmedElement) &&
      !trimmedElement.includes('+')
    )
  })

  return result.join(' ')
}

export default selectMaker
