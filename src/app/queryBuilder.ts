import { IAuthorizedFields, IQueryBuilder, IReceviedQuery, ISelector, IUser } from '../types'
import objectPicker from '../utils/objectPicker'
import queryMaker from '../utils/queryMaker'
import queryPagination from './queryPagination'
import querySelector from './querySelector'

/**
 * Query Builder Function
 * @param receviedQuery - Pass req.query
 * @param user - The decoded JWT, It should be have _id, role || null
 * @param authorizedFields - Set of allowed operations for the field
 * @param authorizedSelector - Pass the authorized selector
 */
const queryBuilder = (
  receviedQuery: IReceviedQuery,
  user: IUser,
  authorizedFields: IAuthorizedFields,
  authorizedSelector: ISelector
): IQueryBuilder => {
  // Step 1: Get permissible field names
  const keys = authorizedFields.filter.map(item => item[0])

  // Step 2: Picking query elements from permissible field names
  const queryElements = objectPicker(receviedQuery, keys)

  // Step 3: Final query, pagination, selector
  const { query, authentication } = queryMaker(queryElements, authorizedFields, user)
  const pagination = queryPagination(receviedQuery)
  const selector = querySelector(receviedQuery, authorizedSelector)

  return {
    query,
    authentication,
    pagination,
    selector
  }
}

export default queryBuilder
