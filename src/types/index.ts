/* eslint-disable @typescript-eslint/no-explicit-any */

export type Pagination = {
  page: number
  limit: number
  skip: number
  sort: string
}

export type Populate = {
  path: string
  select: Select
  populate: Populate[]
}

export type Query = Record<string, any>

export type Select = string

export type QueryMaker = {
  query: Query
  select: Select
  populate: Populate[]
  pagination: Pagination
}

export type QuerySelector = {
  select: Select
  populate: Populate[]
}

export type QueryPagination = {
  current: number
  total: number
  next: number | null
  prev: number | null
  records: number
}

export type QueryExecutor = {
  data: Record<string, any>[]
  pagination: QueryPagination
  executes: QueryMaker
}

export type User = {
  _id: string
  role: string
  [key: string]: any
} | null

export type ReqQuery = Record<string, unknown>

export type Operations =
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$in'
  | '$nin'
  | '$all'
  | '$size'
  | '$exists'
  | '$type'
  | '$regex'
  | '$mod'

export type NestedKey<O extends Record<string, unknown>, ProcessedKeys extends string = ''> = {
  [K in Extract<keyof O, string>]: K extends ProcessedKeys
    ? K
    : O[K] extends Array<Record<string, unknown>>
    ? `${K}` | `${K}.${NestedKey<O[K][number], `${ProcessedKeys},${K}`>}`
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKey<O[K], `${ProcessedKeys},${K}`>}`
    : K
}[Extract<keyof O, string>]

export type AuthRules<T extends Record<string, unknown>, R> = {
  authentication: 'OPEN' | [R[], 'OPEN' | NestedKey<T>[]][]
  query: [NestedKey<T>, Operations[]][]
  select: NestedKey<T>[]
  populate: [string, string[]][]
}

// --- For Internal Use Only --- //
export type TAuthRules = {
  authentication: 'OPEN' | [string[], 'OPEN' | string[]][]
  query: [string, Operations[]][]
  select: string[]
  populate: [string, string[]][]
}
export type TPagination = (q: ReqQuery) => Pagination
export type TPopulate = (input: string | string[], rules: Pick<TAuthRules, 'populate'>) => Populate[]
export type TSelect = (input: string, rules: Pick<TAuthRules, 'select'>) => Select
export type TQuery = (
  elements: ReqQuery,
  user: User,
  rules: Pick<TAuthRules, 'authentication' | 'query'>
) => Query
export type TQueryMaker = (q: ReqQuery, user: User, rules: TAuthRules) => QueryMaker
export type TQuerySelector = (q: ReqQuery, rules: TAuthRules) => QuerySelector
export type TQueryPagination = (page: number, limit: number, count: number) => QueryPagination
export type TQueryExecutor = (q: ReqQuery, user: User, rules: TAuthRules) => Promise<QueryExecutor>
