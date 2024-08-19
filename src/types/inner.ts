import {
  AuthRules,
  Input,
  Obj,
  Operators,
  QueryExecutor,
  QueryMaker,
  QueryPagination,
  QuerySelector,
  User
} from '.'

type Query = QueryMaker['query']
type Select = QueryMaker['select']
type Populate = QueryMaker['populate']
type Pagination = QueryMaker['pagination']

type Rules = AuthRules<Record<string, unknown>, string>
type QRules = [string, Operators[]]

export type QueryMakerFN = (data: { input: Partial<Input>; user: User; key: Key }) => QueryMaker
export type QuerySelectorFN = (data: { input: Partial<Input>; user: User; rules: Rules }) => QuerySelector
export type QueryPaginationFN = (data: { page: number; limit: number; count: number }) => QueryPagination
export type QueryExecutorFN = (data: {
  input: Partial<Input>
  user: User
  rules: Rules
  options?: Obj
}) => Promise<QueryExecutor>

export type QueryFN = (this: TBase, input: Input, user: User, key: Key) => Query
export type SelectFN = (this: TBase, input: Input['select'], user: User, key: Key | Rules['select']) => Select
export type PopulateFN = (
  this: TBase,
  input: Input['populate'],
  user: User,
  key: Key | Rules['populate']
) => Populate
export type PaginationFN = (this: TBase, input: Input['pagination'], key: Key) => Pagination

export type AuthManagerFN = (
  authentication: Rules['authentication'],
  user: User
) => {
  auth: 'OPEN' | string[]
  authQuery: Obj | null
}

export type SelectFormatterFN = (
  user: User,
  rules: Rules['select']
) => {
  pipe: string
  protectedReturn: string
  defaultReturn: string
}

export type QBuilderFN = (input: Input['query'], user: User, authRules: Rules) => Obj[]
export type QHandlerFN = (value: Obj[], rules: QRules, user: User, authRules: Rules) => Obj
export type QValidatorFN = (
  key: string,
  operator: Operators,
  value: unknown,
  rules: QRules,
  user: User,
  authRules: Rules
) => void

export type Key = keyof TBase['registry']

export type TBase = {
  registry: Record<string, Rules>
  connection: boolean
  keys: () => Key[]
  get: <T extends 'normal' | 'strict' = 'normal'>(
    key: Key,
    mode?: T | 'normal' | 'strict'
  ) => T extends 'strict' ? Rules : Rules | null
  set: (key: Key, rules: Rules) => Key
  registerRules: <T extends Rules>(key: Key, rules: T) => Key
  connect: () => void
  query: QueryFN
  select: SelectFN
  populate: PopulateFN
  pagination: PaginationFN
}
