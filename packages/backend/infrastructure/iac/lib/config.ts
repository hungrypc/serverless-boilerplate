const BASE_DOMAIN = 'philip-chan.me'
const API_PREFIX = 'api'

export const getConfig = (stage: string) => {
  let config = {
    domainName: `${stage}.${BASE_DOMAIN}`,
    apiPrefix: API_PREFIX,
    apiGateway: {
      restApiDomainName: `api.${stage}.${BASE_DOMAIN}`,
    },
  }

  switch (stage) {
    case 'production':
      config = {
        ...config,
        domainName: BASE_DOMAIN,
        apiGateway: {
          restApiDomainName: `api.${BASE_DOMAIN}`,
        },
      }
      break
    default:
      config = {
        ...config,
        /** stage relevant changes */
      }
      break
  }

  return config
}
