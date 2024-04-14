export const selectFormatter = (input: string[]) => {
  return {
    negative: input.length ? '-' + input.join(' -') : '',
    pipe: input.join('|')
  }
}
