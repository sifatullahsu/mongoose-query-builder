import { pagination } from './app/pagination'
import { populate } from './app/populate'
import { query } from './app/query'
import { select } from './app/select'
import {
  AuthRules,
  Pagination,
  Populate,
  Query,
  QueryMaker,
  QuerySelector,
  Select,
  SelectorRules,
  TQueryMaker,
  TQuerySelector
} from './types'

const queryMaker: TQueryMaker = (q, user, authRules, selectorRules) => {
  return {
    query: query(q, user, authRules),
    select: select(q.select as string, selectorRules.select),
    populate: populate(q.populate as string | string[], selectorRules.populate),
    pagination: pagination(q)
  }
}

const querySelector: TQuerySelector = (q, selectorRules) => {
  return {
    select: select(q.select as string, selectorRules.select),
    populate: populate(q.populate as string | string[], selectorRules.populate)
  }
}

export {
  AuthRules,
  Pagination,
  Populate,
  Query,
  QueryMaker,
  QuerySelector,
  Select,
  SelectorRules,
  queryMaker,
  querySelector
}
