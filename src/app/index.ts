import { TBase } from '../types'
import { Base } from './base'

type IBase = {
  new (): TBase
}

export const instance = new (Base as unknown as IBase)()

export const { registerRules, connect } = instance
