export const negativeSelect = (input: string[]) => {
  return input.map(x => `-${x}`).join(' ')
}
