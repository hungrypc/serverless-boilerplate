import * as apiGateway from '@aws-cdk/aws-apigateway'
import * as certificatemanager from '@aws-cdk/aws-certificatemanager'
import * as route53 from '@aws-cdk/aws-route53'
import * as targets from '@aws-cdk/aws-route53-targets'
import * as cdk from '@aws-cdk/core'

interface RestApiProps {
  hostedZone: route53.IHostedZone
  domainName: string
  apiPrefix: string
  certificate: certificatemanager.ICertificate
}

export class RestApi extends apiGateway.RestApi {
  public aRecord: route53.ARecord

  constructor(
    scope: cdk.Construct,
    id: string,
    context: { stage: string; serviceName: string; serviceFullName: string; orgName: string },
    { certificate, hostedZone, domainName, apiPrefix }: RestApiProps,
  ) {
    super(scope, `${context.stage}-${id}`, {
      deployOptions: {
        stageName: context.stage,
      },
      domainName: {
        domainName: domainName,
        certificate,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS,
        allowHeaders: [...apiGateway.Cors.DEFAULT_HEADERS, 'access-token', 'x-correlated-request-id'],
      },
    })

    const errorResponseModel = this.addModel('ErrorResponseModel', {
      contentType: 'application/json',
      modelName: 'ErrorResponseModel',
      schema: {
        title: 'errorResponse',
        type: apiGateway.JsonSchemaType.OBJECT,
        properties: {
          message: { type: apiGateway.JsonSchemaType.STRING },
        },
      },
    })

    this.root.addMethod('ANY', undefined, {
      methodResponses: [
        {
          statusCode: '500',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
          },
          responseModels: {
            'application/json': errorResponseModel,
          },
        },
        {
          // Same thing for the error responses
          statusCode: '400',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
          },
          responseModels: {
            'application/json': errorResponseModel,
          },
        },
      ],
    })

    this.aRecord = new route53.ARecord(this, `${context.stage}-route-53-api-gateway-a-record`, {
      zone: hostedZone,
      recordName: apiPrefix,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(this)),
    })

    new cdk.CfnOutput(this, `${context.stage}-rest-api-id`, {
      exportName: `${context.stage}-rest-api-id`,
      value: this.restApiId,
    })

    new cdk.CfnOutput(this, `${context.stage}-rest-api-root-resource-id`, {
      exportName: `${context.stage}-rest-api-root-resource-id`,
      value: this.restApiRootResourceId,
    })
  }
}
