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
  | '$not'
  | '$all'
  | '$size'
  | '$elemMatch'
  | '$exists'
  | '$type'
  | '$regex'
  | '$options'
  | '$mod'
  | '$text'
  | '$bitsAllClear'
  | '$bitsAllSet'
  | '$bitsAnyClear'
  | '$bitsAnySet'

export type Validator<T extends Record<string, unknown>> = (data: {
  key: T
  operator: Operations
  value: any
  rules: [NestedKey<T>, Operations[]]
  user: User
}) => boolean

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
  validator?: Validator<T>
  defaultValue?: {
    pagination?: Partial<Pagination>
    select?: NestedKey<T>[]
    populate?: [string, string[]][]
  }
}

// --- For Internal Use Only --- //
export type TValidator = (data: {
  key: string
  operator: Operations
  value: any
  rules: [string, Operations[]]
  user: User
}) => boolean
export type TAuthRules = {
  authentication: 'OPEN' | [string[], 'OPEN' | string[]][]
  query: [string, Operations[]][]
  select: {
    protected: string[]
    default: string[]
    additional?: {
      roles: string[]
      protected: string[]
      default: string[]
    }[]
  }
  populate: PopulateV3
  pagination?: Partial<Pagination>
  validator?: TValidator
}

type PopulateV2 = {
  path: string
  select?: string[]
  populate?: PopulateV2[]
}

type PopulateV3 = {
  path: string
  select: [string[], string[]]
  populate: PopulateV3
}[]

export type PopulateV4 = {
  path: string
  select: string
  populate: PopulateV4[]
}

export type TPagination = (q: Partial<Pagination>, defaultValue?: Partial<Pagination>) => Pagination
export type TSelect = (input: string[], user: User, rules: TAuthRules['select']) => Select
export type TPopulate = (input: PopulateV2[], rules: TAuthRules['populate']) => PopulateV4[]
export type TQuery = (q: ReqQuery, user: User, rules: TAuthRules) => Query
export type TQueryMaker = (q: ReqQuery, user: User, rules: TAuthRules) => QueryMaker
export type TQuerySelector = (q: ReqQuery, rules: TAuthRules) => QuerySelector
export type TQueryPagination = (page: number, limit: number, count: number) => QueryPagination
export type TQueryExecutor = (q: ReqQuery, user: User, rules: TAuthRules) => Promise<QueryExecutor>
export type TBuilder = (q: ReqQuery[], user: User, authRules: TAuthRules) => Query[]
export type TValueHandler = (data: {
  value: Record<string, any>[]
  rules: [string, Operations[]]
  user: User
  authRules: TAuthRules
}) => Record<string, any>
export type TValueValidator = (data: {
  key: string
  operator: Operations
  value: any
  rules: [string, Operations[]]
  user: User
  authRules: TAuthRules
}) => void
