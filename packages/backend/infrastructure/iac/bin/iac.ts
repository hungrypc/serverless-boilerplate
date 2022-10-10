#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'

import { Context } from '../lib/context'
import { IacStack } from '../lib/iac-stack'

const app = new cdk.App()

const SERVICE_BASE_NAME = 'global-infrastructure'
const STAGE = app.node.tryGetContext('stage')

if (!STAGE) {
  throw Error('stage must be provided')
}

const SERVICE_FULL_NAME = `${STAGE}-${SERVICE_BASE_NAME}`
const STACK_NAME = STAGE === 'production' ? SERVICE_BASE_NAME : `${STAGE}-${SERVICE_BASE_NAME}`

const context: Context = {
  stage: app.node.tryGetContext('stage') || '',
  serviceName: SERVICE_BASE_NAME,
  serviceFullName: SERVICE_FULL_NAME,
  orgName: 'philip-chan',
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  account: process.env.AWS_PERSONAL_ACCOUNT_ID as string,
}

console.log(`Deploying infra on stack ${STACK_NAME}`)
console.log(`Using context:`, context)

new IacStack(app, STACK_NAME, context)
