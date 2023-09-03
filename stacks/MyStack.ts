import { StackContext, Api, Queue } from "sst/constructs";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";

const chromeAwsLayerArn =
  "arn:aws:lambda:us-east-1:176217690016:layer:chromium:2";

export function API({ stack }: StackContext) {
  const chromwAwsLayer = LayerVersion.fromLayerVersionArn(
    stack,
    "ChromeLayer",
    chromeAwsLayerArn
  );

  const queue = new Queue(stack, "queue", {
    consumer: {
      function: {
        handler: "packages/functions/src/scraper/actor.handler",
        layers: [chromwAwsLayer],
        timeout: 30,
      },
      cdk: {
        eventSource: {
          maxConcurrency: 5,
        },
      },
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [queue],
      },
    },
    routes: {
      "GET /scrape": {
        function: {
          handler: "packages/functions/src/scraper/lambda.handler",
          layers: [chromwAwsLayer],
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
