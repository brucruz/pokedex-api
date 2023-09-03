import { StackContext, Api } from "sst/constructs";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";

const chromeAwsLayerArn =
  "arn:aws:lambda:us-east-1:176217690016:layer:chromium:2";

export function API({ stack }: StackContext) {
  const chromwAwsLayer = LayerVersion.fromLayerVersionArn(
    stack,
    "ChromeLayer",
    chromeAwsLayerArn
  );

  const api = new Api(stack, "api", {
    routes: {
      "GET /scraper": {
        function: {
          handler: "packages/functions/src/lambda.handler",
          layers: [chromwAwsLayer],
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
