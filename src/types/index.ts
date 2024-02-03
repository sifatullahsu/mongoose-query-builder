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
  permission: [NestedKey<T>, Operations[]][]
}

export type SelectorRules<T extends Record<string, unknown>> = {
  select: NestedKey<T>[]
  populate: [string, string[]][]
}

// --- For Internal Use Only --- //
export type TAuthRules = {
  authentication: 'OPEN' | [string[], 'OPEN' | string[]][]
  permission: [string, Operations[]][]
}
export type TSelectorRules = {
  select: string[]
  populate: [string, string[]][]
}
export type TPagination = (q: ReqQuery) => Pagination
export type TPopulate = (input: string | string[], authorized: TSelectorRules['populate']) => Populate[]
export type TSelect = (input: string, exclude: TSelectorRules['select']) => Select
export type TQuery = (elements: ReqQuery, user: User, rules: TAuthRules) => Query
export type TQueryMaker = (
  q: ReqQuery,
  user: User,
  authRules: TAuthRules,
  selectorRules: TSelectorRules
) => QueryMaker
export type TQuerySelector = (q: ReqQuery, selectorRules: TSelectorRules) => QuerySelector
