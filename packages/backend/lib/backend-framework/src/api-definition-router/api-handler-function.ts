import { Args, RouteDefinition } from '../api-definition'

type ResponseType<T extends RouteDefinition> = ReturnType<T['responseValidator']>

type FunctionWithArgs<T extends RouteDefinition> = (args: Args<T>) => ResponseType<T>
type FunctionWithoutArgs<T extends RouteDefinition> = () => ResponseType<T>

export type ApiHandlerFunction<T extends RouteDefinition> = Args<T> extends never
  ? FunctionWithoutArgs<T>
  : FunctionWithArgs<T>
