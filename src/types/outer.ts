import { NestedKey, Obj, Operators, User } from '.'

export type QueryMaker = {
  query: Obj | Obj[]
  select: string
  populate: {
    path: string
    select: QueryMaker['select']
    populate: QueryMaker['populate']
  }[]
  pagination: {
    page: number
    limit: number
    skip: number
    sort: string
  }
  findOne: boolean
}

export type QuerySelector = {
  select: QueryMaker['select']
  populate: QueryMaker['populate']
}

export type QueryPagination = {
  current: number
  total: number
  next: number | null
  prev: number | null
  records: number
}

export type QueryExecutor =
  | {
      data: Obj[]
      pagination: QueryPagination
      executes: QueryMaker
    }
  | {
      data: Obj | null
      executes: QueryMaker
    }

export type PopulateRules<T extends Record<string, unknown>, R> = {
  path: NestedKey<T>
  select: AuthRules<T, R>['select']
  roles?: [R, ...R[]]
}

export type AuthRules<T extends Record<string, unknown>, R> = {
  authentication: 'OPEN' | [[R, ...R[]], 'OPEN' | [NestedKey<T>, ...NestedKey<T>[]]][]

  query: {
    fields: [NestedKey<T>, Operators[]][]
    additional?: {
      roles: [R, ...R[]]
      fields: [NestedKey<T>, Operators[]][]
    }[]
  }

  select: {
    protected: NestedKey<T>[]
    default: NestedKey<T>[]
    additional?: {
      roles: [R, ...R[]]
      protected: AuthRules<T, R>['select']['protected']
      default: AuthRules<T, R>['select']['default']
    }[]
  }

  populate: {
    path: NestedKey<T>
    select: AuthRules<Record<string, unknown>, R>['select']
    populate: AuthRules<Record<string, unknown>, R>['populate']
    roles?: [R, ...R[]]
  }[]

  pagination?: Partial<QueryMaker['pagination']>

  validator?: (data: {
    key: string
    operator: Operators
    value: unknown
    rules: Operators[]
    user: User
  }) => boolean

  queryType?: {
    disabled: ('$or' | '$nor')[]
    additional?: {
      roles: [R, ...R[]]
      disabled: ('$or' | '$nor')[]
    }[]
  }
}

export type Input = {
  query: Obj[]
  queryType: '$and' | '$or' | '$nor'
  select: string[]
  populate: {
    path: string
    select?: Input['select']
    populate?: Input['populate']
  }[]
  pagination: Partial<QueryMaker['pagination']>
  findOne: boolean
}
