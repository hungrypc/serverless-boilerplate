import { RestApiContext } from '@app/serverless-rest-api-router'

import { MissingPathParameterError } from './errors'

export class Controller {
  protected context: RestApiContext

  async initialize(context: RestApiContext) {
    this.context = context
  }

  getPathParameter(key: string) {
    return this.context.awsEvent.pathParameters[key]
  }

  getPathParameterOrThrow(key: string) {
    const value = this.context.awsEvent.pathParameters[key]

    if (!value) {
      throw new MissingPathParameterError(key)
    }
  }
}
