import { IamRoleStatement } from 'serverless/aws'

export const ssm: IamRoleStatement = {
  Effect: 'Allow',
  Action: [
    'ssm:GetParameter',
    'ssm:GetParameters',
    'ssm:GetParametersByPath',
    'ssm:DescribeParameters',
    'ssm:PutParameter',
  ],
  Resource: [
    {
      'Fn::Join': [
        ':',
        [
          'arn:aws:ssm',
          {
            Ref: 'AWS::Region',
          },
          {
            Ref: 'AWS::AccountId',
          },
          '*',
        ],
      ],
    },
  ],
}
