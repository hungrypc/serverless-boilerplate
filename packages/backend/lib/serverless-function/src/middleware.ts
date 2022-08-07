import { Context } from '@app/common'

export interface Middleware<T extends Context = Context> {
  (ctx: T, next: () => void): Promise<void>
}

export function composeMiddlewares(middlewares: Middleware[]): (context: Context, next?: Middleware) => Promise<void> {
  return function (context: Context, next: Middleware): Promise<void> {
    let index = -1

    function dispatch(i: number): Promise<void> {
      if (i <= index) {
        Promise.reject(new Error('next() called multiple times'))
      }

      index = i

      let middleware: Middleware = middlewares[i]

      if (i === middlewares.length) {
        middleware = next
      }

      if (!middleware) {
        return Promise.resolve()
      }

      try {
        return Promise.resolve(
          middleware(context, function next(): Promise<void> {
            return dispatch(i + 1)
          }),
        )
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
