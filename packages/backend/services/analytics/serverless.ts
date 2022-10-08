import { generateServerlessRestApiConfig } from '@app/serverless-framework'

import { authenticatedApi, publicApi } from './src'
import { config } from './src/config'

const serverlessConfig = generateServerlessRestApiConfig({
  ...config,
  apiHandlers: {
    authenticatedApi,
    publicApi,
  },
})

module.exports = serverlessConfig
