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

export type QueryMakerFN = (data: { input: Partial<Input>; user: User; rules: Rules }) => QueryMaker
export type QuerySelectorFN = (data: { input: Partial<Input>; user: User; rules: Rules }) => QuerySelector
export type QueryPaginationFN = (data: { page: number; limit: number; count: number }) => QueryPagination
export type QueryExecutorFN = (data: {
  input: Partial<Input>
  user: User
  rules: Rules
  options?: Obj
}) => Promise<QueryExecutor>

export type QueryFN = (input: Input, user: User, authRules: Rules) => Query
export type SelectFN = (input: Input['select'], user: User, rules: Rules['select']) => Select
export type PopulateFN = (input: Input['populate'], user: User, rules: Rules['populate']) => Populate
export type PaginationFN = (input: Input['pagination'], rules: Rules['pagination']) => Pagination

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
