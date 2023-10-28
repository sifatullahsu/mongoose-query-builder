import { IQueryPagination, IReceviedQuery } from '../types'

/**
 * Query Pagination Function
 * @param receviedQuery - Pass req.query
 */
const queryPagination = (receviedQuery: IReceviedQuery): IQueryPagination => {
  let page = receviedQuery.page ? parseInt(receviedQuery.page as string, 10) : 1
  let limit = receviedQuery.limit ? parseInt(receviedQuery.limit as string, 10) : 10

  // Ensure that 'page' is not less than 1
  if (page < 1 || isNaN(page)) {
    page = 1
  }

  // Ensure that 'limit' is not less than 1
  if (limit < 1 || isNaN(limit)) {
    limit = 1
  }

  const skip = (page - 1) * limit
  const sort = (receviedQuery.sort as string) || 'createdAt'

  return {
    page,
    limit,
    skip,
    sort
  }
}

export default queryPagination
