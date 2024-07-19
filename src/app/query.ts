import { AuthRules } from '../schema'
import { Query, TQuery } from '../types'
import { authManager } from '../utils/authManager'
import { builder } from '../utils/builder'

export const query: TQuery = (q, user, authRules) => {
  const { authQuery } = authManager(authRules.authentication, user)
  const output = builder(q.query as Query[], user, authRules)

  const $and: Query[] = authQuery ? [authQuery] : []

  if (q.queryType === '$and') {
    $and.push(...output)
  } else {
    $and.push({ [q.queryType as string]: output })
  }

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}

const user = {
  _id: '646c817b303ae9cca93ad11b',
  role: 'mentor',
  aditional: 'ss'
}
const serviceAuthRules: AuthRules = {
  authentication: [
    [['admin', 'super_admin'], 'OPEN'],
    [['seller'], ['sellerId']],
    [['mentor'], ['mentorId', 'userId']]
  ],
  query: [
    ['category', ['$eq', '$ne']],
    ['mentor', ['$eq', '$not', '$gte', '$lte']],
    ['status', ['$eq', '$in', '$nin']],
    ['packages.price', ['$gt', '$gte', '$lt', '$lte']],
    ['title', ['$regex']],
    ['$text', ['$search', '$language', '$caseSensitive', '$diacriticSensitive']],
    ['counts', ['$elemMatch', '$lte', '$gte']], // number[]
    ['socials', ['$elemMatch']], // object[]
    ['socials.platform', ['$eq']],
    ['socials.followers', ['$gte']],
    ['socials.createdAt', ['$gte']]
  ],
  select: ['password', 'contact'],
  populate: [
    ['mentor', ['password']],
    ['category', []],
    ['topics', []],
    ['topics.category', []]
  ],
  validator: () => true,
  defaultValue: {
    pagination: {
      limit: 2
    }
  }
}
const inputQuery = [
  { category: [['$eq', 2]] },
  { mentor: [['$eq', 2]] },
  { status: [['$in', [2]]] },
  // { gender: [['$not.$eq', 'female']] },
  {
    'packages.price': [
      ['$gte', 2],
      ['$lte', 5]
    ]
  },
  { category: [['$eq', 2]] },
  {
    $or: [{ mentor: [['$eq', 2]] }, { mentor: [['$eq', 2]] }, { mentor: [['$eq', 2]] }]
  },
  {
    $text: [
      ['$search', 'coffee'],
      ['$language', 'es'],
      ['$caseSensitive', true],
      ['$diacriticSensitive', true]
    ]
  },
  {
    mentor: [
      [
        '$not',
        [
          ['$gte', 20],
          ['$gte', 50]
        ]
      ]
    ],
    mentor: [
      [
        '$not',
        [
          ['$gte', 20],
          ['$lte', 80]
        ]
      ],
      ['$gte', 50],
      ['$lte', 500]
    ]
  },
  {
    counts: [
      [
        '$elemMatch',
        [
          ['$gte', 80],
          ['$lte', 85]
        ]
      ]
    ]
  },
  {
    socials: [
      [
        '$elemMatch',
        [
          { 'socials.platform': [['$eq', 'facebook']] },
          { 'socials.followers': [['$gte', 10000]] },
          { 'socials.createdAt': [['$gte', new Date()]] }
        ]
      ]
    ]
  }
]

const start = performance.now()

// const inputResult = inputValidator({ query: inputQuery }, user, serviceAuthRules)

// const result = builder(inputQuery, serviceAuthRules, user)
// console.log(JSON.stringify(result, null, 2))

const result = query({ query: inputQuery, queryType: '$and' }, user, serviceAuthRules)

const duration = performance.now() - start

console.log(duration)
// console.log(JSON.stringify(result, null, 4))
console.log(result)
