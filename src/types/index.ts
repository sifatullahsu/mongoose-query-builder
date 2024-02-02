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

export type MakerFields<T extends Record<string, unknown>, R> = {
  all: 'OPEN' | R[]
  filter: [NestedKey<T>, Operations[], 'OPEN' | [R[], 'OPEN' | NestedKey<T>[]][]][]
}

export type SelectorFields<T extends Record<string, unknown>> = {
  select: NestedKey<T>[]
  populate: [string, string[]][]
}

// --- For Internal Use Only --- //
type TMakerFields = {
  all: 'OPEN' | string[]
  filter: [string, Operations[], 'OPEN' | [string[], 'OPEN' | string[]][]][]
}
type TSelectorFields = {
  select: string[]
  populate: [string, string[]][]
}
export type TPagination = (q: ReqQuery) => Pagination
export type TPopulate = (input: string | string[], authorized: TSelectorFields['populate']) => Populate[]
export type TSelect = (input: string, exclude: TSelectorFields['select']) => Select
export type TQuery = (elements: ReqQuery, user: User, authorized: TMakerFields) => Query
export type TQueryMaker = (
  q: ReqQuery,
  user: User,
  makerFields: TMakerFields,
  selectorFields: TSelectorFields
) => QueryMaker
export type TQuerySelector = (q: ReqQuery, selectorFields: TSelectorFields) => QuerySelector
