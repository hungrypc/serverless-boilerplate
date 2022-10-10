import * as AWS from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

import { Logger } from '@app/logger'

import { Context, Parameters } from './types'

export class SSMClient {
  private client: AWS.SSM
  private context: Context
  public logger: Logger

  constructor(context: Context) {
    this.client = new AWS.SSM()
    this.context = context
    this.logger = Logger(context)
  }

  private async getParametersByPath(
    params: AWS.SSM.GetParametersByPathRequest,
  ): Promise<PromiseResult<AWS.SSM.GetParametersByPathResult, AWS.AWSError>> {
    !this.context.silent && this.logger.debug(`Started fetching config from SSM with path ${params.Path}`)
    const result = await this.client.getParametersByPath(params).promise()
    !this.context.silent && this.logger.debug(`Completed fetching config from SSM with path ${params.Path}`)

    return result
  }

  async putParameter(
    params: AWS.SSM.PutParameterRequest,
  ): Promise<PromiseResult<AWS.SSM.PutParameterResult, AWS.AWSError>> {
    !this.context.silent && this.logger.debug(`Started setting config to SSM with name ${params.Name}`)
    const result = await this.client.putParameter(params).promise()
    !this.context.silent && this.logger.debug(`Completed setting config to SSM with name ${params.Name}`)

    return result
  }

  async fetchParametersByPath(startWith: string): Promise<Parameters> {
    const params: AWS.SSM.GetParametersByPathRequest = { Path: startWith }
    let requestResult: AWS.SSM.GetParametersByPathResult = await this.getParametersByPath(params)
    const ssmParameters: Parameters = {}

    while (requestResult) {
      requestResult?.Parameters?.forEach(parameter => {
        const paramName = parameter?.Name?.split('/').pop()

        if (!paramName) return

        ssmParameters[paramName] = {
          from: startWith,
          value: parameter.Value,
          type: parameter.Type || 'String',
        }
      })

      if (!requestResult.NextToken) break

      params.NextToken = requestResult.NextToken
      requestResult = await this.getParametersByPath(params)
    }

    return ssmParameters
  }
}
