import { Context as AwsContext } from 'aws-lambda'

import { InvocationContext } from './invocation-context'
import { composeMiddlewares, Middleware } from './middleware'
import { ServerlessResponse } from './serverless-response'

export function handlerBuilder<T, C extends InvocationContext<T>>(
  context: {
    serviceName: string
    stage?: string
  },
  middlewares: Middleware[] = [],
  specificInvocationContextBuilder?: (context: InvocationContext<T>, awsEvent: T, awsContext: AwsContext) => C,
) {
  return (handler: Middleware) => {
    const runInvocation = composeMiddlewares([...middlewares, handler])

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
