import { z } from 'zod'

export const operatorSchema = z.enum([
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
const fieldSchema = z.tuple([z.string(), z.array(operatorSchema).nonempty()])
const rolesSchema = z.array(z.string()).nonempty()
const authenticationSchema = z
  .enum(['OPEN'])
  .or(z.array(z.tuple([z.array(z.string()).nonempty(), z.enum(['OPEN']).or(z.array(z.string()).nonempty())])))
const querySchema = z.object({
  fields: z.array(fieldSchema),
  additional: z
    .array(
      z.object({
        roles: rolesSchema,
        fields: z.array(fieldSchema) // ------ SELF
      })
    )
    .optional()
})
const selectSchema = z.object({
  protected: z.array(z.string()),
  default: z.array(z.string()),
  additional: z
    .array(
      z.object({
        roles: rolesSchema,
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
    roles: rolesSchema.optional()
  })
)
const validatorSchema = z.function().returns(z.boolean())
const queryTypeSchema = z.object({
  disabled: z.array(z.enum(['$or', '$nor'])),
  additional: z
    .array(
      z.object({
        roles: rolesSchema,
        disabled: z.array(z.enum(['$or', '$nor']))
      })
    )
    .optional()
})
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
  pagination: paginationSchema.partial().optional(),
  validator: validatorSchema.optional(),
  queryType: queryTypeSchema.optional()
})

export const inputSchema = z.object({
  query: z.array(z.any()).default([]),
  queryType: z.enum(['$and', '$or', '$nor']).default('$and'),
  select: z.array(z.string().trim()).default([]),
  populate: z
    .array(
      z.object({
        path: z.string().trim()
        // select:  ------ SELF
        // populate:   ------ SELF
      })
    )
    .default([]),
  pagination: z
    .object({
      page: pageSchema.optional(),
      limit: limitSchema.optional(),
      skip: skipSchema.optional(),
      sort: sortSchema.optional()
    })
    .partial()
    .default({}),
  findOne: z.boolean().default(false)
})
