/* eslint-disable @typescript-eslint/no-explicit-any */
import { pagination } from './app/pagination'
import { populate } from './app/populate'
import { query } from './app/query'
import { select } from './app/select'
import { authRulesSchema, inputSchema, userSchema } from './schema'
import {
  AuthRules,
  Input,
  Operators,
  PopulateRules,
  QueryExecutor,
  QueryExecutorFN,
  QueryMaker,
  QueryMakerFN,
  QueryPagination,
  QueryPaginationFN,
  QuerySelector,
  QuerySelectorFN
} from './types'

const queryMaker: QueryMakerFN = ({ input, user, rules }) => {
  userSchema.parse(user)
  authRulesSchema.parse(rules)
  const result = inputSchema.parse(input)

  return {
    query: query(result, user, rules),
    select: select(result.select, user, rules.select),
    populate: populate(result.populate, user, rules.populate),
    pagination: pagination(result.pagination, rules?.pagination),
    findOne: result.findOne
  }
}

const querySelector: QuerySelectorFN = ({ input, user, rules }) => {
  userSchema.parse(user)
  authRulesSchema.parse(rules)
  const result = inputSchema.parse(input)

  return {
    select: select(result.select, user, rules.select),
    populate: populate(result.populate, user, rules.populate)
  }
}

const queryPagination: QueryPaginationFN = ({ page, limit, count }) => {
  return {
    current: page,
    total: Math.ceil(count / limit),
    next: page < Math.ceil(count / limit) ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    records: count
  }
}

const queryExecutor: QueryExecutorFN = async function (this: any, { input, user, rules, options = {} }) {
  const queryResult = queryMaker({ input, user, rules })

  const { query, pagination, populate, select, findOne } = queryResult
  const { page, limit, skip, sort } = pagination

  if (findOne) {
    const result = this.findOne(query, select, { ...options, populate })

    return {
      data: result,
      executes: queryResult
    }
  }

  const [result, count] = await Promise.all([
    this.find(query, select, { ...options, limit, skip, sort, populate }),
    this.countDocuments(query)
  ])

  const paginationResult = queryPagination({ page, limit, count })

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
  authRulesSchema,
  Input,
  inputSchema,
  MongooseQueryMaker,
  Operators,
  PopulateRules,
  QueryExecutor,
  queryExecutor,
  QueryMaker,
  queryMaker,
  QueryPagination,
  queryPagination,
  QuerySelector,
  querySelector,
  userSchema
}
