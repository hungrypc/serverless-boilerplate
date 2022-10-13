import mongoose, { CollectionBase } from 'mongoose'

import { Model } from './types'

interface SimpleIndexDefinition {
  [key: string]: 1 | -1 | 'text'
}

interface IndexWithOptionsDefinition {
  fields: SimpleIndexDefinition
  options?: {
    name?: string
    unique?: boolean
    sparse?: boolean
    expireAfterSeconds?: number
  }
}

type IndexDefinition = SimpleIndexDefinition | IndexWithOptionsDefinition

interface BuildCollectionOptions {
  isSoftDeletable?: boolean
}

const isIndexWithOptionsDefinition = (indexDef: IndexDefinition): indexDef is IndexWithOptionsDefinition => {
  return !!(indexDef as IndexWithOptionsDefinition).fields
}

function buildCollection<T>(
  collectionName: string,
  schema: mongoose.Schema,
  indicesDefinition: IndexDefinition[] = [],
  options: BuildCollectionOptions = {},
): Model<T> {
  indicesDefinition.forEach(indexDefinition => {
    if (isIndexWithOptionsDefinition(indexDefinition)) {
      schema.index(indexDefinition.fields, indexDefinition.options)
    } else {
      schema.index(indexDefinition)
    }
  })

  const { isSoftDeletable } = options
  if (isSoftDeletable) {
    schema.add({ deletedAt: { type: String } })
  }

  schema.set('timestamps', true)

  return mongoose.model<T & mongoose.Document>(collectionName, schema)
}

export { CollectionBase, buildCollection }
