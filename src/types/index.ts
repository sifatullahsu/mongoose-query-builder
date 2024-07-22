/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { operatorSchema, userSchema } from '../schema'

export type NestedKey<O extends Record<string, unknown>, ProcessedKeys extends string = ''> = {
  [K in Extract<keyof O, string>]: K extends ProcessedKeys
    ? K
    : O[K] extends Array<Record<string, unknown>>
    ? `${K}` | `${K}.${NestedKey<O[K][number], `${ProcessedKeys},${K}`>}`
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKey<O[K], `${ProcessedKeys},${K}`>}`
    : K
}[Extract<keyof O, string>]

export type Obj = Record<string, any>

export type Operators = z.infer<typeof operatorSchema>

export type User = z.infer<typeof userSchema>

export * from './outer'

export * from './inner'
