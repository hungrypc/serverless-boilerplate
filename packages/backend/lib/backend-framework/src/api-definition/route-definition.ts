/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import { HttpMethod, StatusCodes } from '@app/common'
import { AsyncReturnType, StrictOmitNeverPick } from '@app/ts-utils'

export type RouteDefinition<
  ResponsePayload extends unknown = unknown,
  RequestPayload extends unknown = unknown,
  PathParams extends Record<string, string> = Record<string, string>,
  QueryParams extends Record<string, string | boolean | number | string[]> = Record<
    string,
    string | boolean | number | string[]
  >,
> = {
  path: string
  method: HttpMethod
  authenticated?: boolean
  successStatusCode?: StatusCodes
  responseValidator?: (payload: unknown) => Promise<ResponsePayload>
  payloadValidator?: (payload: unknown) => Promise<RequestPayload>
  pathParamsValidator?: (params: unknown) => Promise<PathParams>
  queryParamsValidator?: (params: unknown) => Promise<QueryParams>
}

export type PathParamsType<T extends RouteDefinition> = T extends {
  pathParamsValidator: (pathParams: unknown) => Promise<unknown>
}
  ? AsyncReturnType<T['pathParamsValidator']>
  : never

export type QueryParamsType<T extends RouteDefinition> = T extends {
  queryParamsValidator: (queryParams: unknown) => Promise<unknown>
}
  ? AsyncReturnType<T['queryParamsValidator']>
  : never

export type PayloadType<T extends RouteDefinition> = T extends {
  payloadValidator: (payload: unknown) => Promise<unknown>
}
  ? AsyncReturnType<T['payloadValidator']>
  : never

export type DataType<T extends RouteDefinition> = T extends {
  responseValidator: (data: unknown) => Promise<unknown>
}
  ? AsyncReturnType<T['responseValidator']>
  : never

type ArgsDefinition<T extends RouteDefinition> = {
  pathParams: PathParamsType<T>
  queryParams: QueryParamsType<T>
  payload: PayloadType<T>
}

export type Args<T extends RouteDefinition> = StrictOmitNeverPick<ArgsDefinition<T>>
