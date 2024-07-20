import { z } from 'zod'

const operatorSchema = z.enum([
  '$eq',
  '$ne',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$in',
  '$nin',
  '$not',
  '$all',
  '$size',
  '$elemMatch',
  '$exists',
  '$type',
  '$regex',
  '$options',
  '$mod',
  // '$text',
  '$search',
  '$language',
  '$caseSensitive',
  '$diacriticSensitive',
  '$bitsAllClear',
  '$bitsAllSet',
  '$bitsAnyClear',
  '$bitsAnySet'
])
const authenticationSchema = z
  .enum(['OPEN'])
  .or(z.array(z.tuple([z.array(z.string()).nonempty(), z.enum(['OPEN']).or(z.array(z.string()).nonempty())])))
const querySchema = z.array(
  z.tuple([
    z.string(),
    z.array(operatorSchema).nonempty(),
    z.enum(['OPEN']).or(z.array(z.string()).nonempty())
  ])
)
const selectSchema = z.object({
  protected: z.array(z.string()),
  default: z.array(z.string()),
  additional: z
    .array(
      z.object({
        roles: z.array(z.string()).nonempty(),
        protected: z.array(z.string()),
        default: z.array(z.string())
      })
    )
    .optional()
})
const populateSchema = z.array(
  z.object({
    path: z.string(),
    select: selectSchema.optional(),
    // populate: populateSchema.optional(),
    roles: z.array(z.string()).nonempty().optional()
  })
)
const pageSchema = z.number().int().positive()
const limitSchema = z.number().int().positive()
const skipSchema = z.number().int().nonnegative()
const sortSchema = z.string()
const paginationSchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  skip: skipSchema,
  sort: sortSchema
})

export const userSchema = z.null().or(
  z.object({
    _id: z.string().regex(/^[0-9a-f]{24}$/),
    role: z.string()
  })
)

export const authRulesSchema = z.object({
  authentication: authenticationSchema,
  query: querySchema,
  select: selectSchema,
  populate: populateSchema,
  pagination: paginationSchema.partial(),
  validator: z.function().returns(z.boolean()).optional(),
  disableQueryType: z.enum(['$or', '$nor']).optional()
})

export const queryInputSchema = z.object({
  page: pageSchema.optional(),
  limit: limitSchema.optional(),
  skip: skipSchema.optional(),
  sort: sortSchema.optional(),
  select: selectSchema.optional(),
  populate: populateSchema.optional(),
  query: z.array(z.any()).default([]),
  queryType: z.enum(['$and', '$or', '$nor']).default('$and'),
  findOne: z.boolean().default(false)
})

export type AuthRules = z.infer<typeof authRulesSchema>
export type User = z.infer<typeof userSchema>
export type QueryInput = z.infer<typeof queryInputSchema>

export const inputValidator = (query: QueryInput, user: User, rules: AuthRules) => {
  // page, limit, skip, sort, query, select, populate, queryType, findOne

  userSchema.parse(user)
  authRulesSchema.parse(rules)
  const result = queryInputSchema.parse(query)

  return result
}
