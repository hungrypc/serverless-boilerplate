import mongoose, { ExtractMongooseArray, Schema as BaseSchema, SchemaOptions } from 'mongoose'

import { Primitive } from '@app/ts-utils'

import { Constructor } from './types'

export const SchemaTypes = mongoose.SchemaTypes
// const Schema = mongoose.Schema

export class TypedSchema<T> extends BaseSchema<T> {
  constructor(def: SchemaDefinition<T>, options?: SchemaOptions) {
    super(def, options)
  }
}

type DefaultType<T> = T extends BaseSchema.Types.Mixed ? any : Partial<ExtractMongooseArray<T>>

type SchemaTypeOptions<T, K> = {
  type: T | typeof TypedSchema.Types.Mixed
  enum?: K[]
  default?: DefaultType<K> | K
  required?: boolean
  minlength?: T extends Array<unknown> ? number : never
  maxlength?: T extends Array<unknown> ? number : never
}

type SchemaLike<T> = TypedSchema<T> | SchemaDefinition<T>

// Infer SchemaDefinition type based on the Generic T type.
export type SchemaDefinition<T> = {
  [K in keyof T]-?: T[K] extends Primitive
    ? SchemaTypeOptions<Constructor<T[K]>, T[K]>
    : T[K] extends Array<infer E>
    ? E extends Primitive
      ? SchemaTypeOptions<Constructor<E>[], E[]>
      : SchemaLike<T[K]> | SchemaTypeOptions<SchemaLike<T[K]>, T[K]>
    : SchemaLike<T[K]> | SchemaTypeOptions<SchemaLike<T[K]>, T[K]>
}

export const buildSchema = <T>(definition: SchemaDefinition<T>, options?: SchemaOptions) => {
  return new TypedSchema<T>(definition, options)
}
