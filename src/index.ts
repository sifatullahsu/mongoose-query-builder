/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect, instance, registerRules } from './app'
import { authRulesSchema, inputSchema, userSchema } from './schema'
import {
  AuthRules,
  Input,
  Operators,
  PopulateRules,
  QueryExecutor,
  QueryExecutorFN,
  QueryMaker,
  QueryMakerFN,
  QueryPagination,
  QueryPaginationFN,
  QuerySelector
} from './types'

registerRules('blogs', {
  authentication: [
    [['admin'], 'OPEN'],
    [['subscriber'], ['user']]
  ],
  query: {
    fields: [
      ['user', ['$eq']],
      ['category', ['$eq']],
      ['mentor', ['$eq']],
      ['status', ['$in']]
    ]
  },
  select: { default: [], protected: ['password'] },
  populate: [
    {
      path: 'mentor',
      ref: 'mentor',
      select: { default: [], protected: [] },
      populate: [
        {
          path: 'author',
          ref: 'author',
          select: { default: [], protected: [] },
          populate: [
            {
              path: 'name',
              ref: 'name',
              select: { default: [], protected: [] },
              populate: []
            }
          ]
        }
      ]
    },
    {
      path: 'category',
      ref: 'category',
      select: { default: [], protected: [] },
      populate: []
    }
  ]
})

console.log(
  instance.query(
    { query: [{ category: [['$eq', 2]] }, { mentor: [['$eq', 2]] }, { status: [['$in', [2]]] }] },
    { _id: '', role: 'admin' },
    'blogs'
  )
)
console.log(instance.pagination({ page: 3 }, 'blogs'))
console.log(instance.select(['dd', 'password', 'aa'], null, 'blogs'))
console.log(
  instance.populate(
    [
      {
        path: 'mentor',
        select: ['name', 'email'],
        populate: [
          {
            path: 'author',
            populate: [
              {
                path: 'items'
              }
            ]
          }
        ]
      },
      {
        path: 'category',
        select: ['title', 'slug']
      },
      {
        path: 'topics',
        populate: [
          {
            path: 'items'
          }
        ]
      }
    ],
    null,
    'blogs'
  )
)

const queryMaker: QueryMakerFN = ({ input, user, key }) => {
  userSchema.parse(user)
  // authRulesSchema.parse(rules)
  const result = inputSchema.parse(input)

  // return {
  //   query: query(result, user, rules),
  //   select: select(result.select, user, rules.select),
  //   populate: populate(result.populate, user, rules.populate),
  //   pagination: pagination(result.pagination, rules?.pagination),
  //   findOne: result.findOne
  // }

  return {
    query: instance.query(result, user, key),
    select: instance.select(result.select, user, key),
    populate: instance.populate(result.populate, user, key),
    pagination: instance.pagination(result.pagination, key),
    findOne: result.findOne
  }
}

// const querySelector: QuerySelectorFN = ({ input, user, rules }) => {
//   userSchema.parse(user)
//   authRulesSchema.parse(rules)
//   const result = inputSchema.parse(input)

//   return {
//     select: select(result.select, user, rules.select),
//     populate: populate(result.populate, user, rules.populate)
//   }
// }

const queryPagination: QueryPaginationFN = ({ page, limit, count }) => {
  return {
    current: page,
    total: Math.ceil(count / limit),
    next: page < Math.ceil(count / limit) ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    records: count
  }
}

const queryExecutor: QueryExecutorFN = async function (this: any, { input, user, rules, options = {} }) {
  const queryResult = queryMaker({ input, user, rules })

  const { query, pagination, populate, select, findOne } = queryResult
  const { page, limit, skip, sort } = pagination

  if (findOne) {
    const result = this.findOne(query, select, { ...options, populate })

    return {
      data: result,
      executes: queryResult
    }
  }

  const [result, count] = await Promise.all([
    this.find(query, select, { ...options, limit, skip, sort, populate }),
    this.countDocuments(query)
  ])

  const paginationResult = queryPagination({ page, limit, count })

  return {
    data: result,
    pagination: paginationResult,
    executes: queryResult
  }
}

const MongooseQueryMaker = (schema: any) => {
  schema.statics.queryExecutor = queryExecutor
}

export {
  AuthRules,
  authRulesSchema,
  connect,
  Input,
  inputSchema,
  MongooseQueryMaker,
  Operators,
  PopulateRules,
  QueryExecutor,
  queryExecutor,
  QueryMaker,
  queryMaker,
  QueryPagination,
  queryPagination,
  QuerySelector,
  // querySelector,
  registerRules,
  userSchema
}
