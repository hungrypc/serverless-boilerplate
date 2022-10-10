import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda'

import { Logger } from '@app/logger'
import { handlerBuilder, InvocationContext, Middleware } from '@app/serverless-function'

import { verifyAuthenticationAndGetPolicy } from './handle-auth'

async function handleAuthenticationCheck(
  context: InvocationContext<APIGatewayRequestAuthorizerEvent>,
  next: Function,
): Promise<void> {
  const logger = Logger(context)

  logger.info('path: ', {
    path: context.awsEvent.path,
    proxy: context.awsEvent.pathParameters?.proxy,
  })

  context.response = await verifyAuthenticationAndGetPolicy(context)
  await next()
}

const handler = handlerBuilder<APIGatewayRequestAuthorizerEvent, InvocationContext<APIGatewayRequestAuthorizerEvent>>({
  serviceName: 'api-gateway-authorizer',
  stage: process.env.STAGE,
})(handleAuthenticationCheck as unknown as Middleware)

export { handler }
