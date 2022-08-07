import { authApiAuthorizer } from '..'
import { CORS } from './cors'

const RestApiConfig = {
  authenticatedApi: {
    prefix: 'auth',
    authorizer: authApiAuthorizer,
  },
  publicApi: {
    prefix: 'public',
    authorizer: {},
  },
}

export const prefixedRestApiProxyFunction = ({
  functionName,
  handler,
}: {
  functionName: keyof typeof RestApiConfig
  handler: string
}) => {
  const { prefix, authorizer = {} } = RestApiConfig[functionName]

  return restApiProxyFunction({
    functionName,
    prefix,
    handler,
    authorizer,
  })
}

export const restApiProxyFunction = ({
  functionName,
  prefix,
  path,
  handler,
  authorizer = {},
}: {
  functionName: string
  path?: string
  prefix?: string
  handler: string
  authorizer?: object
}) => {
  const fullPath = path || (prefix ? `\${self:service}/${prefix}/` : `\${self:service}/`)

  return {
    [functionName]: {
      name: `\${self:provider.stackName}-${functionName}`,
      handler,
      events: [
        {
          http: {
            path: `${fullPath}{proxy+}`,
            method: 'ANY',
            ...CORS,
            ...authorizer,
          },
        },
        {
          http: {
            path: fullPath,
            method: 'ANY',
            ...CORS,
            ...authorizer,
          },
        },
      ],
    },
  }
}
