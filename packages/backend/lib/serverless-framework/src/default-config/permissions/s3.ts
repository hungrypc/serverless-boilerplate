import { IamRoleStatement } from 'serverless/aws'

export const s3: IamRoleStatement = {
  Effect: 'Allow',
  Action: '*',
  Resource: [
    {
      'Fn::Join': [':', ['arn:aws:s3', '', '', '*']],
    },
  ],
}
