import { IamRoleStatement } from 'serverless/aws'

export const eventPublisher: IamRoleStatement = {
  Effect: 'Allow',
  Action: ['events:PutEvents'],
  Resource: [
    {
      'Fn::Join': [
        ':',
        [
          'arn:aws:events',
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
