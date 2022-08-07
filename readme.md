# serverless boilerplate: backend

boilerplate for monorepo, though only the backend (+ common folder to share types between FE and BE)

serverless to deploy to aws, structured with (event-driven) microservice architecture in mind

use to create an api utilizing api-gateway to handle and auth requests that are sent to various lambdas for services generated via [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts)

makes use of (yarn) workspaces for packages
## stack

- [ts](https://www.typescriptlang.org/)
- [serverless](https://www.serverless.com/)
