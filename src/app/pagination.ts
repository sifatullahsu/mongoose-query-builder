import { TPagination } from '../types'

export const pagination: TPagination = (q, defaultValue) => {
  if (Array.isArray(q.page)) throw new Error('Multiple `page` found.')
  if (Array.isArray(q.limit)) throw new Error('Multiple `limit` found.')
  if (Array.isArray(q.skip)) throw new Error('Multiple `skip` found.')
  if (Array.isArray(q.sort)) throw new Error('Multiple `sort` found.')

  const value = {
    page: defaultValue?.page || 1,
    limit: defaultValue?.limit || 20,
    skip: defaultValue?.skip || 0,
    sort: defaultValue?.sort || 'createdAt'
  }

  const page = parseInt(q.page as string) || value.page
  const limit = parseInt(q.limit as string) || value.limit
  const skip = (parseInt(q.skip as string) || value.skip) + (page - 1) * limit
  const sort = q.sort ? (q.sort as string).replace(/,/g, ' ') : value.sort

  return { page, limit, skip, sort }
}
