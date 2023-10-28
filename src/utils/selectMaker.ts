const selectMaker = (input: string | string[], authorizedSelect: string[]): string => {
  if (!input) return ''
  if (Array.isArray(input)) throw new Error('Multiple select found.')

  const inputArray = input.split(',')
  const result = inputArray.filter((element: string) => !authorizedSelect.includes(element))

  return result.join(' ')
}

export default selectMaker
