import { IAuthorizedFields, IQueryMaker, IReceviedQuery, ISelector, IUser } from '../types'
import objectPicker from '../utils/objectPicker'
import queryBuilder from '../utils/queryBuilder'
import queryPagination from './queryPagination'
import querySelector from './querySelector'

/**
 * Query Maker Function
 * @param receviedQuery - Pass req.query
 * @param user - The decoded JWT, It should be have _id, role || null
 * @param authorizedFields - Set of allowed operations for the field
 * @param authorizedSelector - Pass the authorized selector
 */
const queryMaker = (
  receviedQuery: IReceviedQuery,
  user: IUser,
  authorizedFields: IAuthorizedFields,
  authorizedSelector: ISelector
): IQueryMaker => {
  // Step 1: Get permissible field names
  const keys = authorizedFields.filter.map(item => item[0])

  // Step 2: Picking query elements from permissible field names
  const queryElements = objectPicker(receviedQuery, keys)

  // Step 3: Final query, pagination, selector
  const { query, authentication } = queryBuilder(queryElements, authorizedFields, user)
  const pagination = queryPagination(receviedQuery)
  const selector = querySelector(receviedQuery, authorizedSelector)

  return {
    query,
    authentication,
    pagination,
    selector
  }
}

export default queryMaker
