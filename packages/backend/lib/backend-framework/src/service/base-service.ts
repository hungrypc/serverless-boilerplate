import { Context } from '@app/common'
import { RestApiContext } from '@app/serverless-rest-api-router'

const isRestApiContext = (context: Context): context is RestApiContext => {
  return !!(context as RestApiContext).awsEvent
}

export const BaseService = ({ context }: { context: Context }) => {
  return {
    context: context,
    ipAddress: isRestApiContext(context) ? context.awsEvent.requestContext?.identity.sourceIp || 'unknown' : 'unknown',
  }
}
