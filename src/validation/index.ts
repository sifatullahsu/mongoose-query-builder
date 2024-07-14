/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { Query, TAuthRules } from '../types'

export const querySchema = (query: Query, defaultValue?: TAuthRules['defaultValue']) => {
  // page, limit, skip, sort, query, select, populate

  const schema = z.object({
    page: z
      .number()
      .int()
      .positive()
      .default(defaultValue?.pagination?.page || 1),
    limit: z
      .number()
      .int()
      .positive()
      .default(defaultValue?.pagination?.limit || 20),
    skip: z
      .number()
      .int()
      .nonnegative()
      .default(defaultValue?.pagination?.skip || 0),
    sort: z.string().default(defaultValue?.pagination?.sort || 'createdAt'),
    select: z.string().default(''),
    populate: z.string().default(''),
    query: z.object({}).default({})
  })

  return schema.safeParse(query)
}
