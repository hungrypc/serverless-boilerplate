import { generateServerlessRestApiConfig } from '@app/serverless-framework'

const serverlessConfig = generateServerlessRestApiConfig({
  stage: process.env.STAGE! as string,
  serviceName: 'api-gateway-authorizer',
  resources: {
    Resources: {
      ApiGatewayAuthorizer: {
        Type: 'AWS::ApiGateway::Authorizer',
        DependsOn: 'AuthorizerLambdaFunction',
        Properties: {
          Type: 'REQUEST',
          Name: '${self:custom.stage}-${self:service}',
          IdentitySource: 'method.request.header.Authorization',
          AuthorizerUri: {
            'Fn::Join': [
              '',
              [
                'arn:aws:apigateway:us-east-1:lambda:path/',
                '2015-03-31/functions/',
                'arn:aws:lambda:us-east-1:${env:AWS_PERSONAL_ACCOUNT_ID}:function:${self:custom.stage}-${self:service}',
                '/invocations',
              ],
            ],
          },
          RestApiId: {
            'Fn::ImportValue': '${self:custom.stage}-rest-api-id',
          },
        },
      },
      ApiGatewayAuthorizerLambdaPermissions: {
        Type: 'AWS::Lambda::Permission',
        DependsOn: 'ApiGatewayAuthorizer',
        Properties: {
          FunctionName: '${self:custom.stage}-${self:service}',
          Action: 'lambda:InvokeFunction',
          Principal: {
            'Fn::Join': [
              '.',
              [
                'apigateway',
                {
                  Ref: 'AWS::URLSuffix',
                },
              ],
            ],
          },
        },
      },
    },
    Outputs: {
      ApiGatewayAuthorizer: {
        Value: {
          Ref: 'ApiGatewayAuthorizer',
        },
        Export: {
          Name: '${self:custom.stage}-api-gateway-authorizer',
        },
      },
    },
  },
  functions: {
    authorizer: {
      name: '${self:custom.stage}-${self:service}',
      handler: 'dist/index.handler',
    },
  },
})

module.exports = serverlessConfig
