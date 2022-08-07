import { APIGatewayEvent } from 'aws-lambda'

import { RestApiContext as CommonRestApiContext } from '@app/common'
import { InvocationContext } from '@app/serverless-function'

export type RestApiContext = InvocationContext<APIGatewayEvent> & CommonRestApiContext
