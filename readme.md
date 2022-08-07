# serverless boilerplate: backend

boilerplate for monorepo, though only the backend (+ common folder to share types between FE and BE)

serverless to deploy to aws, made with (event-driven) microservice architecture in mind, infrastructure as code

use to create an api (via cloudformation) utilizing api-gateway to handle and auth requests that are then sent to various service lambdas generated from [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts)

makes use of (yarn) workspaces for packages

## stack

- [ts](https://www.typescriptlang.org/)
- [serverless](https://www.serverless.com/)

## todo

- user auth? redis?
- logging w cloudwatch?
- dynamodb?
- simplify pls
- add testing
