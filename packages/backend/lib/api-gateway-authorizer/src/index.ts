import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda'

import { handlerBuilder, InvocationContext, Middleware } from '@app/serverless-function'

import { verifyJwtAuthenticationAndGetPolicy } from './handle-auth-jwt'

async function handleAuthenticationCheck(
  context: InvocationContext<APIGatewayRequestAuthorizerEvent>,
  next: Function,
): Promise<void> {
  await verifyJwtAuthenticationAndGetPolicy(context)
  await next()
}

const handler = handlerBuilder<APIGatewayRequestAuthorizerEvent, InvocationContext<APIGatewayRequestAuthorizerEvent>>({
  serviceName: 'api-gateway-authorizer',
  stage: process.env.STAGE,
})(handleAuthenticationCheck as unknown as Middleware)

export { handler }
