type IType = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => Partial<T>

const objectPicker: IType = (obj, keys) => {
  const finalObj: Partial<typeof obj> = {}

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key]
    }
  }
  return finalObj
}

export default objectPicker
