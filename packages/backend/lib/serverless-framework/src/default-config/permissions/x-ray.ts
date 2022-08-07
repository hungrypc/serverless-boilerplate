import { IamRoleStatement } from 'serverless/aws'

export const xRay: IamRoleStatement = {
  Effect: 'Allow',
  Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
  Resource: '*',
}
