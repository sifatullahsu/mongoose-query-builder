import { TPagination } from '../types'

export const pagination: TPagination = q => {
  if (Array.isArray(q.page)) throw new Error('Multiple `page` found.')
  if (Array.isArray(q.limit)) throw new Error('Multiple `limit` found.')
  if (Array.isArray(q.sort)) throw new Error('Multiple `sort` found.')
  if (Array.isArray(q.skip)) throw new Error('Multiple `skip` found.')

  const page = Number(q.page) || 1
  const limit = Number(q.limit) || 20
  const skip = (Number(q.skip) || 0) + (page - 1) * limit
  const sort = q.sort ? (q.sort as string).replace(/,/g, ' ') : 'createdAt'

  return { page, limit, skip, sort }
}
