import { generateServerlessRestApiConfig } from '@app/serverless-framework'

import { authenticatedApi } from './src'
import { config } from './src/config'

const serverlessConfig = generateServerlessRestApiConfig({
  stage: config.stage,
  serviceName: config.apiName,
  apiHandlers: {
    authenticatedApi,
  },
})

module.exports = serverlessConfig
