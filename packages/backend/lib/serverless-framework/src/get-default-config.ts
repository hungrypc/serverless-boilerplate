export const BASE_DOMAIN = 'philip-chan.me'

export const getDefaultConfig = (serviceName: string) => ({
  apiName: `${serviceName}-api`,
  serviceName: `${serviceName}-service`,
  stage: process.env.STAGE,
  frameworkVersion: '3',
})
