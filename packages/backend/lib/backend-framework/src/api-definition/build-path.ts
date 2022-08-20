import { PromiseResolvedType } from '@app/ts-utils'

import { RouteDefinition } from '.'

type PathParams<T extends RouteDefinition> = T['pathParamsValidator'] extends (...args: any) => any
  ? PromiseResolvedType<ReturnType<T['pathParamsValidator']>>
  : never

type QueryParams<T extends RouteDefinition> = T['queryParamsValidator'] extends (...args: any) => any
  ? PromiseResolvedType<ReturnType<T['queryParamsValidator']>>
  : never

const arrayQueryParamMapper = (key: string, value: string[]) => {
  const mappedArrayValue = value.map(v => encodeURIComponent(v))
  return `${key}=[${mappedArrayValue}]`
}

export const buildPath = <T extends RouteDefinition>(
  route: T,
  pathParams: Partial<PathParams<T>> = null,
  queryParams: Partial<QueryParams<T>> = null,
) => {
  let path = route.path

  pathParams &&
    Object.keys(pathParams).forEach(paramKey => {
      const prefixedKey = paramKey.startsWith(':') ? paramKey : `:${paramKey}`

      path = path.replace(prefixedKey, pathParams[paramKey])
    })

  const concatenatedQueryParams =
    queryParams &&
    Object.entries(queryParams)
      .map(([key, value]) =>
        Array.isArray(value) ? arrayQueryParamMapper(key, value) : `${key}=${encodeURIComponent(value)}`,
      )
      .join('&')

  if (concatenatedQueryParams) {
    path = `${path}?${concatenatedQueryParams}`
  }

  return path
}
