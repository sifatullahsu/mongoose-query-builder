/* eslint-disable @typescript-eslint/no-explicit-any */
import { pagination } from './app/pagination'
import { populate } from './app/populate'
import { query } from './app/query'
import { select } from './app/select'
import {
  AuthRules,
  Pagination,
  Populate,
  Query,
  QueryExecutor,
  QueryMaker,
  QueryPagination,
  QuerySelector,
  Select,
  TQueryExecutor,
  TQueryMaker,
  TQueryPagination,
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

const queryPagination: TQueryPagination = (page, limit, count) => {
  return {
    current: page,
    total: Math.ceil(count / limit),
    next: page < Math.ceil(count / limit) ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    records: count
  }
}

const queryExecutor: TQueryExecutor = async function (this: any, q, user, rules) {
  const queryResult = queryMaker(q, user, rules)

  const { query, pagination, populate, select } = queryResult
  const { page, limit, skip, sort } = pagination

  const result = await this.find(query, select, { limit, skip, sort, populate })
  const count = await this.countDocuments(query)

  const paginationResult = queryPagination(page, limit, count)

  return {
    data: result,
    pagination: paginationResult,
    executes: queryResult
  }
}

const MongooseQueryMaker = (schema: any) => {
  schema.statics.queryExecutor = queryExecutor
}

export {
  AuthRules,
  MongooseQueryMaker,
  Pagination,
  Populate,
  Query,
  QueryExecutor,
  QueryMaker,
  QueryPagination,
  QuerySelector,
  Select,
  TQueryExecutor,
  queryExecutor,
  queryMaker,
  queryPagination,
  querySelector
}
