import { TPagination } from '../types'

export const pagination: TPagination = (q, paginationRules) => {
  const page = q.page || paginationRules?.page || 1
  const limit = q.limit || paginationRules?.limit || 20
  const skip = (q.skip || paginationRules?.skip || 0) + (page - 1) * limit
  const sort = q.sort ? q.sort.replace(/,/g, ' ') : paginationRules?.sort || 'createdAt'

  return { page, limit, skip, sort }
}
