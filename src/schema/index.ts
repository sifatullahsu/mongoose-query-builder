import { z } from 'zod'

const userSchema = z.null().or(
  z.object({
    _id: z.string().regex(/^[0-9a-f]{24}$/),
    role: z.string()
  })
)
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
const querySchema = z.array(z.tuple([z.string(), z.array(operatorSchema).nonempty()]))
const selectSchema = z.array(z.string())
const populateSchema = z.array(z.tuple([z.string(), z.array(z.string())]))
const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  skip: z.number().int().nonnegative(),
  sort: z.string()
})
export const authRulesSchema = z.object({
  authentication: authenticationSchema,
  query: querySchema,
  select: selectSchema,
  populate: populateSchema,
  defaultValue: z
    .object({
      select: selectSchema,
      populate: populateSchema,
      pagination: paginationSchema.partial()
    })
    .partial()
    .optional(),
  validator: z.function().returns(z.boolean()).optional()
  // findOne: z.boolean().optional(),
  // queryType: z.enum(['$and', '$or', '$not']).optional()
})

export type authRulesTypes = z.infer<typeof authRulesSchema>
export type userTypes = z.infer<typeof userSchema>
