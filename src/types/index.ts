/* eslint-disable @typescript-eslint/no-explicit-any */
export type IReceviedQuery = Record<string, unknown>

export type IQueryPagination = {
  page: number
  limit: number
  skip: number
  sort: string
}

export type IQueryBuilder = {
  query: Record<string, any>
  authentication: Record<string, any>
  pagination: IQueryPagination
  selector: IQuerySelector
}

export type IPopulate = { path: string; select: string; populate: IPopulate[] }

export type IQuerySelector = {
  select: string
  populate: IPopulate[]
}

export type IUser = {
  _id: string
  role: string
  [key: string]: any
} | null

export type ISelector = {
  select: string[]
  populate: [string, string[]][]
}

export type IDeselector = Record<string, string[]>

export type IQuerySelectorFields = {
  select: string[]
  populate: [string, string[]][]
}

export type NestedKey<O extends Record<string, unknown>, ProcessedKeys extends string = ''> = {
  [K in Extract<keyof O, string>]: K extends ProcessedKeys
    ? K // If the key has already been processed, stop recursion
    : O[K] extends Array<Record<string, unknown>>
    ? `${K}` | `${K}.${NestedKey<O[K][number], `${ProcessedKeys},${K}`>}`
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKey<O[K], `${ProcessedKeys},${K}`>}`
    : K
}[Extract<keyof O, string>]

export type IQueryOperations =
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

export type IQueryAuthentication<T, R> = [R, T | 'OPEN'][] | [['ANY', 'OPEN']] | 'OPEN'

export type IQueryBuilderFields<T extends Record<string, unknown>, R> = {
  all: 'OPEN' | R[]
  filter: [NestedKey<T>, IQueryOperations[], IQueryAuthentication<NestedKey<T>, R>][]
}

export type IAuthorizedFields = { all: 'OPEN' | string[]; filter: any[][] }
