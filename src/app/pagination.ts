import { PaginationFN } from '../types'

export const pagination: PaginationFN = function (input, key) {
  const rules = this.get(key, 'strict').pagination

  const page = input?.page || rules?.page || 1
  const limit = input?.limit || rules?.limit || 20
  const skip = (input?.skip || rules?.skip || 0) + (page - 1) * limit
  const sort = input?.sort ? input.sort.replace(/,/g, ' ') : rules?.sort || 'createdAt'

  return { page, limit, skip, sort }
}
