import { AsyncFunction, AsyncReturnType } from '@app/ts-utils'

type ServiceTypes = 'auth' | 'anonymous'
type Service = AsyncFunction<{ [key in ServiceTypes]?: AsyncFunction }>

export type NestedAsyncReturnType<
  S extends AsyncFunction,
  K extends keyof AsyncReturnType<S>,
> = S extends AsyncReturnType<AsyncFunction>
  ? AsyncReturnType<S>[K] extends AsyncFunction
    ? AsyncReturnType<AsyncReturnType<S>[K]>
    : AsyncReturnType<S>[K]
  : never

export type ServiceReturnType<S extends Service, K extends keyof AsyncReturnType<S> & ServiceTypes> = S extends Service
  ? NestedAsyncReturnType<S, K>
  : never
