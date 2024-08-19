import { authRulesSchema } from '../schema'
import { TBase } from '../types'
import { pagination } from './pagination'
import { populate } from './populate'
import { query } from './query'
import { select } from './select'

export function Base(this: TBase) {
  this.registry = {}
  this.connection = false

  this.keys = () => Object.keys(this.registry)

  this.get = (key, mode = 'normal') => {
    const result = this.registry[key]

    if (!result && mode === 'strict') {
      throw new Error(`The key '${key}' is not been registered.`)
    }

    return result ?? null
  }

  this.set = (key, rules) => {
    this.registry[key] = rules
    return key
  }

  this.registerRules = (key, rules) => {
    const isRegistered = this.get(key, 'normal')

    if (isRegistered) {
      throw new Error(`The key '${key}' is already been registered.`)
    }

    return this.set(key, rules)
  }

  this.connect = () => {
    const keys = this.keys()

    for (const key of keys) {
      authRulesSchema.parse(this.get(key))
    }

    this.connection = true
  }
}

Base.prototype.query = query
Base.prototype.select = select
Base.prototype.populate = populate
Base.prototype.pagination = pagination
