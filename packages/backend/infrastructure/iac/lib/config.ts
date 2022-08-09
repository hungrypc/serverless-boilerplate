const DOMAIN_NAME = 'philip-chan.me'
const API_PREFIX = 'api'

export const getConfig = () => {
  // stage adjustments here for larger scale
  const config = {
    domainName: DOMAIN_NAME,
    apiPrefix: API_PREFIX,
    apiGateway: {
      restApiDomainName: `api.${DOMAIN_NAME}`,
    },
  }

  return config
}
