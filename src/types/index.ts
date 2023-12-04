/* eslint-disable @typescript-eslint/no-explicit-any */

// export from index.ts
export type IQueryMaker = {
  query: Record<string, any>
  pagination: IQueryPagination
  selector: IQuerySelector
}

// export from index.ts
export type IQueryPagination = {
  page: number
  limit: number
  skip: number
  sort: string
}

// export from index.ts
export type IQuerySelector = {
  select: string
  populate: IPopulate[]
}

export type IPopulate = { path: string; select: string; populate: IPopulate[] }

export type IReceviedQuery = Record<string, unknown>

export type IUser = {
  _id: string
  role: string
  [key: string]: any
} | null

export type ISelector = {
  select: string[]
  populate: [string, string[]][]
}

// export from index.ts
export type IDeselector = Record<string, string[]>

// export from index.ts
export type IQuerySelectorFields = {
  select: string[]
  populate: [string, string[]][]
}

// export from index.ts
export type NestedKey<O extends Record<string, unknown>, ProcessedKeys extends string = ''> = {
  [K in Extract<keyof O, string>]: K extends ProcessedKeys
    ? K // If the key has already been processed, stop recursion
    : O[K] extends Array<Record<string, unknown>>
    ? `${K}` | `${K}.${NestedKey<O[K][number], `${ProcessedKeys},${K}`>}`
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKey<O[K], `${ProcessedKeys},${K}`>}`
    : K
}[Extract<keyof O, string>]

// export from index.ts
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

// export type IQueryAuthentication<T, R> = [R, T | T[] | 'OPEN'][] | [['ANY', T | T[] | 'OPEN']] | 'OPEN'
export type IQueryAuthentication<T, R> = 'OPEN' | [R[], 'OPEN' | T[]][]

// export from index.ts
export type IQueryMakerFields<T extends Record<string, unknown>, R> = {
  all: 'OPEN' | R[] | ['ANY']
  filter: [NestedKey<T>, IQueryOperations[], IQueryAuthentication<NestedKey<T>, R>][]
}

export type IAuthorizedFields = { all: 'OPEN' | string[]; filter: any[][] }
