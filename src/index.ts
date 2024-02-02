import { pagination } from './app/pagination'
import { populate } from './app/populate'
import { query } from './app/query'
import { select } from './app/select'
import {
  FilterFields,
  Pagination,
  Populate,
  Query,
  QueryMaker,
  QuerySelector,
  Select,
  SelectorFields,
  TQueryMaker,
  TQuerySelector
} from './types'

const queryMaker: TQueryMaker = (q, user, filterFields, selectorFields) => {
  return {
    query: query(q, user, filterFields),
    select: select(q.select as string, selectorFields.select),
    populate: populate(q.populate as string | string[], selectorFields.populate),
    pagination: pagination(q)
  }
}

const querySelector: TQuerySelector = (q, selectorFields) => {
  return {
    select: select(q.select as string, selectorFields.select),
    populate: populate(q.populate as string | string[], selectorFields.populate)
  }
}

export {
  FilterFields,
  Pagination,
  Populate,
  Query,
  QueryMaker,
  QuerySelector,
  Select,
  SelectorFields,
  queryMaker,
  querySelector
}
