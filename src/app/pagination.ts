import { PaginationFN } from '../types'

export const pagination: PaginationFN = (input, paginationRules) => {
  const page = input?.page || paginationRules?.page || 1
  const limit = input?.limit || paginationRules?.limit || 20
  const skip = (input?.skip || paginationRules?.skip || 0) + (page - 1) * limit
  const sort = input?.sort ? input.sort.replace(/,/g, ' ') : paginationRules?.sort || 'createdAt'

  return { page, limit, skip, sort }
}
