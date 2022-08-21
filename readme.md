# serverless boilerplate: backend

personal boilerplate for a monorepo, but only the backend impl. (+ common folder to share types between FE and BE if FE is added in later on)

made with (event-driven) microservice architecture in mind, iac

to be used set up an api (for personal use rn so everything is set up to play around with on my own domain)

- first use aws-cdk to build initial infrastructure
  + creates event bus
  + creates s3 deployment bucket
  + sets up rest api on api-gateway with custom domain name mapped
    - creates new A record for api domain, uses custom domain certificate (should be previously set up)
- then use serverless to deploy:
  + custom api-gateway authorizer lambda to handle authenticating requests
  + per service lambdas generated with configurable [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts)

each service can set up:
1. authenticated api
2. public api
3. event bridge

## stack

- [ts](https://www.typescriptlang.org/)
- [aws-cdk](https://github.com/aws/aws-cdk)
- [serverless](https://www.serverless.com/)

## todo

- serverless-webpack instead of serverless-plugin-monorepo to optimize lambda packages
- cli script to deploy all services
- add testing
- ci/cd?

## notes

- ssm paramstore