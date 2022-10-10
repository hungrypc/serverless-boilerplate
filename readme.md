# serverless boilerplate

currently set up for personal use

- iac
- event-driven microservice architecture
- monorepo, service-specific packages, organized by 3 main categories
  + backend
  + common (shared b/t be and fe)
    - api-definition
    - entity
  + ui

## stack
- [ts](https://www.typescriptlang.org/)
- [aws-cdk](https://github.com/aws/aws-cdk)
- [serverless](https://www.serverless.com/)

## todo
- backend:
  + db set ups
- frontend:
  + ssr app cdn
  + frameworks
- overall:
  + cli script -> deploy all service
  + testing
  + ci/cd
- personal:
  + cloudfront cdn for assets
  + store site analytics

# backend notes

- aws-cdk to build [initial infrastructure](https://github.com/hungrypc/serverless-boilerplate/blob/master/packages/backend/infrastructure/iac/lib/iac-stack.ts)
  + event bus
  + s3 deployment bucket
  + ssm param store for shared config values
  + rest api on api-gateway using custom domain
    - creates new A record for api domain, uses custom domain certificate (must be previously set up)
- after which, use serverless to deploy per service lambdas generated with configurable [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts)


each service creates a [mono-lambda ](https://dev.to/aws-builders/the-what-why-and-when-of-mono-lambda-vs-single-function-apis-5cig) per api-type:
- authenticated api
  + uses the custom [api-gateway authorizer](https://github.com/hungrypc/serverless-boilerplate/tree/master/packages/backend/api-gateway-authorizer) lambda to handle authenticating requests
- public api
  + no authorizer, public can access
- event bridge
  + event handler subscribed to specific event shape to pick up and process

## interfaces / example
1. api definition
    + [routes](https://github.com/hungrypc/serverless-boilerplate/blob/master/packages/common/services/analytics/src/api-definition/public-api/routes.ts) - determines path, pathParams/payload/response
2. [controller](https://github.com/hungrypc/serverless-boilerplate/blob/master/packages/backend/services/analytics/src/handlers/public-api/analytics-controller.ts)
    + directs request to correct method call in executed lambda
3. [service](https://github.com/hungrypc/serverless-boilerplate/blob/master/packages/backend/services/analytics/src/services/analytics/service.ts) logic for whatever the endpoint is intended for

# common notes

# ui notes

# misc notes
- using serverless-webpack to optimize lambda packages
  + custom plugin, pkg-up and webpack @ specific versions, build first
  + [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle)?
- because main domain is currently hosted on vercel, had to add CNAME dns record for api route on vercel to fix dns resolution issues
