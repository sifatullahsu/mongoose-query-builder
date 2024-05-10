import { TPagination } from '../types'

export const pagination: TPagination = q => {
  if (Array.isArray(q.page)) throw new Error('Multiple `page` found.')
  if (Array.isArray(q.limit)) throw new Error('Multiple `limit` found.')
  if (Array.isArray(q.sort)) throw new Error('Multiple `sort` found.')
  if (Array.isArray(q.skip)) throw new Error('Multiple `skip` found.')

  const page = parseInt(q.page as string) || 1
  const limit = parseInt(q.limit as string) || 20
  const skip = (parseInt(q.skip as string) || 0) + (page - 1) * limit
  const sort = q.sort ? (q.sort as string).replace(/,/g, ' ') : 'createdAt'

  return { page, limit, skip, sort }
}
