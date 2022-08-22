import path from 'path'

import { Serverless } from '../types'
import { xRay } from './permissions/x-ray'
const serverlessPluginDir = path.join(__dirname, '../../../serverless-plugin')

export const base = ({ stage, serviceName }: { stage: string; serviceName: string }): Serverless => {
  const result: Serverless = {
    service: serviceName,
    plugins: ['serverless-offline', serverlessPluginDir],
    frameworkVersion: '3',
    package: {
      patterns: ['!./**', 'dist/**', 'node_modules/**'],
    },
    custom: {
      stage,
      bundle: {
        sourcemaps: false,
        caching: true,
        forceExclude: ['aws-sdk'],
        packager: 'yarn',
        ignorePackages: ['pg', 'sqlite3', 'tedious', 'pg-hstore'],
      },
    },
    provider: {
      name: 'aws',
      stage: 'dev',
      runtime: 'nodejs14.x',
      region: 'us-east-1',
      timeout: 30,
      iamRoleStatements: [xRay],
      stackName: `${stage}-${serviceName}`,
      apiName: `${stage}-${serviceName}`,
      deploymentBucket: {
        name: `app-${stage}-deployment`,
      },
      environment: {
        STAGE: stage,
      },
    },
  }

  return result
}
