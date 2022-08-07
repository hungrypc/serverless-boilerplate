import { Context as AwsContext } from 'aws-lambda'

import { Context } from '@app/common'

export interface InvocationContext<T> extends Context {
  awsEvent: T
  awsContext: AwsContext
  response: unknown
}
