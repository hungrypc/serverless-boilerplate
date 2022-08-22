# serverless boilerplate: backend

personal monorepo boilerplate, but only the backend impl. here (+ common folder to share types between FE and BE if FE is added in later on)

used to set up an api (currently for personal use rn so everything is set up to play around with on my own domain)

made with (event-driven) microservice architecture in mind, iac

- using aws-cdk to first build [initial infrastructure](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/infrastructure/iac/lib/iac-stack.ts)
  + creates event bus
  + creates s3 deployment bucket
  + sets up rest api on api-gateway with custom domain name mapped
    - creates new A record for api domain, uses custom domain certificate (should be previously set up)
- then using serverless to deploy:
  + custom [api-gateway authorizer](https://github.com/hungrypc/serverless-boilerplate-backend/tree/master/packages/backend/lib/api-gateway-authorizer/src) lambda to handle authenticating requests
  + per service lambdas generated with configurable [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts)

## general set up
each service can create:
- authenticated api
  + uses the custom authorizer lambda to determine policy based on authorization token (jwt)
- public api
  + no authorizer, public can access
- event bridge
  + event handler subscribed to specific event shape to pick up and process

> each [service's](https://github.com/hungrypc/serverless-boilerplate-backend/tree/master/packages/backend/services) api creates a [mono-lambda ](https://dev.to/aws-builders/the-what-why-and-when-of-mono-lambda-vs-single-function-apis-5cig) per api type (auth/public/ebridge), set up via [`serverless.ts`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/services/user/serverless.ts).

### basic steps with examples
1. set up the [route endpoints](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/common/services/user/src/api-definition/public-api/routes.ts)

    --> determines path, pathParams/payload/response & its types
2. set up the service's [controller](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/services/user/src/handlers/public-api/user-controller.ts)

    --> routes path to correct method call in executed lambda

    --> adds to `serverless.ts` [necessary configs](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/default-config/functions/rest-api-proxy.ts)

    --> [`@Route`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/backend-framework/src/api-definition-router/route.ts) decorator builds the actual [handler](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/backend-framework/src/api-definition-router/build-handler.ts)
3. write [service](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/services/user/src/services/user/service.ts) logic for whatever the endpoint is intended for

## stack
- [ts](https://www.typescriptlang.org/)
- [aws-cdk](https://github.com/aws/aws-cdk)
- [serverless](https://www.serverless.com/)

## todo
- remove serverless-plugin-monorepo
- cli script to deploy all services
- better logging
- add testing
- ci/cd?

## notes
- ssm paramstore
- using serverless-webpack to optimize lambda packages
  + custom plugin, pkg-up and webpack @ specific versions, build first
- because main domain is currently hosted on vercel, had to add CNAME dns record for api route on vercel to fix dns resolution issues
