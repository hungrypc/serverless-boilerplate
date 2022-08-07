import { camelCase, isArray, isPlainObject, map, mapKeys, mapValues, snakeCase } from 'lodash'

const deeply = <T extends Function>(run: T) => {
  return (item: unknown, fn: Function): unknown => {
    if (isPlainObject(item)) {
      return run(
        mapValues(item as object, v => deeply(run)(v, fn)),
        fn,
      )
    } else if (isArray(item)) {
      return map(item as unknown[], v => deeply(run)(v, fn))
    }
    return item
  }
}

const camelizeKeys = <T>(object: object): T => {
  return deeply(mapKeys)(object, (_v: unknown, key: string) => camelCase(key)) as T
}

const snakeizeKeys = <T>(object: object): T => {
  return deeply(mapKeys)(object, (_v: unknown, key: string) => snakeCase(key)) as T
}

export { camelizeKeys, snakeizeKeys }
