export const getDefaultConfig = (domainName: string) => ({
  apiName: `${domainName}-api`,
  serviceName: `${domainName}-service`,
  stage: process.env.STAGE,
  frameworkVersion: '3',
})
