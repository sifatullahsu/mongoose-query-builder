import { IQuerySelector, IReceviedQuery, ISelector } from '../types'
import populateMaker from '../utils/populateMaker'
import selectMaker from '../utils/selectMaker'

/**
 * Query Selector Function
 * @param receviedQuery - Pass req.query
 * @param authorizedSelector - Pass the authorized selector
 */
const querySelector = (receviedQuery: IReceviedQuery, authorizedSelector: ISelector): IQuerySelector => {
  const select = selectMaker(receviedQuery.select as string | string[], authorizedSelector.select)
  const populate = populateMaker(receviedQuery.populate as string | string[], authorizedSelector.populate)

  return {
    select,
    populate
  }
}

export default querySelector
