/* eslint-disable no-undefined */
import { TAuthRules, User } from '../types'

export const authManager = (authentication: TAuthRules['authentication'], user: User) => {
  return authentication === 'OPEN'
    ? 'OPEN'
    : Array.isArray(authentication) && user
    ? (authentication.find(([roles]) => roles.includes(user.role)) || [])[1]
    : undefined
}
