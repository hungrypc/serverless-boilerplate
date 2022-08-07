import { IamRoleStatement } from 'serverless/aws'

export const lambda: IamRoleStatement = {
  Effect: 'Allow',
  Action: ['lambda:InvokeAsync', 'lambda:InvokeFunction'],
  Resource: [
    {
      'Fn::Join': [
        ':',
        [
          'arn:aws:lambda',
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
