# serverless boilerplate: backend

personal boilerplate for a monorepo, but only the backend impl. (+ common folder to share types between FE and BE if FE is added in later on)

made with (event-driven) microservice architecture in mind, iac

to be used set up an api (for personal use rn so everything is set up to play around with on my own domain)

- aws-cdk to build initial infrastructure (api-gateway, event-bus, dns certificate)
- serverless to deploy:
  + custom api-gateway authorizer to handle authenticating requests
  + lambdas generated via [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts) for service logic

## stack

- [ts](https://www.typescriptlang.org/)
- [aws-cdk](https://github.com/aws/aws-cdk)
- [serverless](https://www.serverless.com/)

## todo

- user auth? redis?
- logging w cloudwatch?
- dynamodb?
- simplify pls
- add testing

## notes

- set up infrastructure with aws-cdk first, then use serverless to deploy services
- ssm paramstore