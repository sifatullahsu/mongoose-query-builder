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
  TQueryMaker,
  TQuerySelector
} from './types'

const queryMaker: TQueryMaker = (q, user, rules) => {
  return {
    query: query(q, user, { authentication: rules.authentication, query: rules.query }),
    select: select(q.select as string, { select: rules.select }),
    populate: populate(q.populate as string, { populate: rules.populate }),
    pagination: pagination(q)
  }
}

const querySelector: TQuerySelector = (q, rules) => {
  return {
    select: select(q.select as string, { select: rules.select }),
    populate: populate(q.populate as string, { populate: rules.populate })
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
  queryMaker,
  querySelector
}
