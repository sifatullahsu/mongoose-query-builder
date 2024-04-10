import { ReqQuery, TAuthRules, User } from '../types'

export const authManager = (
  authentication: TAuthRules['authentication'],
  user: User
): {
  auth: 'OPEN' | string[]
  authQuery: ReqQuery | null
} => {
  const auth =
    authentication === 'OPEN'
      ? 'OPEN'
      : Array.isArray(authentication) && user
      ? (authentication.find(([roles]) => roles.includes(user.role)) || [])[1]
      : null

  if (!auth) {
    throw new Error('Access denied. Please check your credentials.')
  }

  const authQuery =
    Array.isArray(auth) && user
      ? auth.length > 1
        ? { $or: auth.map(x => ({ [x]: { $eq: user._id } })) }
        : { [auth[0]]: { $eq: user._id } }
      : null

  return {
    auth,
    authQuery
  }
}
