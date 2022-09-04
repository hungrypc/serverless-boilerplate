import { Context as AwsContext } from 'aws-lambda'

import { Context } from '@app/common'

import { composeMiddlewares, Middleware } from './base-middleware'
import { InvocationContext } from './invocation-context'
import { buildLogInvocation, errorHandler } from './middlewares'
import { ServerlessResponse } from './serverless-response'

export function handlerBuilder<T, C extends InvocationContext<T>>(
  context: {
    serviceName: string
    stage?: string
  },
  middlewares: Middleware[] = [],
  specificInvocationContextBuilder?: (context: InvocationContext<T>, awsEvent: T, awsContext: AwsContext) => C,
  invocationStartLogFormatter?: (context: Context) => string,
  invocationEndLogFormatter?: (context: Context) => string,
) {
  return (handler: Middleware) => {
    const runInvocation = composeMiddlewares([
      buildLogInvocation(invocationStartLogFormatter, invocationEndLogFormatter),
      errorHandler,
      ...middlewares,
      handler,
    ])

    return async function eventHandler(awsEvent: T, awsContext: AwsContext): Promise<ServerlessResponse> {
      awsContext.callbackWaitsForEmptyEventLoop = false

      let invocationContext: InvocationContext<T> = {
        ...context,
        stage: context.stage,
        awsEvent,
        awsContext,
        response: undefined,
      } as any

      if (specificInvocationContextBuilder) {
        invocationContext = specificInvocationContextBuilder(invocationContext, awsEvent, awsContext)
      }

      await runInvocation(invocationContext)

      return invocationContext.response
    }
  }
}
