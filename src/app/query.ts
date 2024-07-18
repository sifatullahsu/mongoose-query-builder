import { authRulesTypes } from '../schema'
import { Query, TQuery } from '../types'
import { authManager } from '../utils/authManager'
import { builder } from '../utils/builder'
import { valueModifier } from '../utils/valueModifier'

export const query: TQuery = (q, user, { authentication, query }) => {
  const { auth, authQuery } = authManager(authentication, user)

  const $and: Query = authQuery ? [authQuery] : []

  query.forEach(([key, operations]) => {
    const validKey = q[key]

    if (validKey) {
      if (Array.isArray(auth) && auth.includes(key)) return

      for (const queryValue of Array.isArray(validKey) ? validKey : [validKey]) {
        const [type, value] = queryValue.split(':')

        if (!operations.includes(type)) {
          throw new Error(`Unauthorized: '${type}' on '${key}'`)
        }

        $and.push({ [key]: { [type]: valueModifier(type, value) } })
      }
    }
  })

  return $and.length === 0 ? {} : $and.length === 1 ? $and[0] : { $and }
}

const user = { _id: '', role: '' }
const serviceAuthRules: authRulesTypes = {
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

const start = performance.now()

// const validationResult = authRulesSchema.safeParse(serviceAuthRules)

// console.log(validationResult)

const abc = builder(
  [
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
  ],
  serviceAuthRules,
  user
)

// console.log(JSON.stringify(abc, null, 2))

const duration = performance.now() - start

console.log(duration)
