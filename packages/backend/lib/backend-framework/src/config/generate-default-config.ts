export const getDefaultConfig = (domainName: string) => ({
  domainName,
  apiName: `${domainName}-api`,
  serviceName: `${domainName}-service`,
  stage: process.env.STAGE,
})
