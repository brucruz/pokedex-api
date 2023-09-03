import { StackContext, Api, Queue, RDS } from "sst/constructs";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";

const chromeAwsLayerArn =
  "arn:aws:lambda:us-east-1:176217690016:layer:chromium:2";

export function API({ stack }: StackContext) {
  const chromwAwsLayer = LayerVersion.fromLayerVersionArn(
    stack,
    "ChromeLayer",
    chromeAwsLayerArn
  );

  const databaseName = "Pokedex";

  const database = new RDS(stack, "database", {
    engine: "postgresql13.9",
    defaultDatabaseName: databaseName,
    migrations: "services/migrations",
  });

  const queue = new Queue(stack, "queue", {
    consumer: {
      function: {
        handler: "packages/functions/src/scraper/actor.handler",
        bind: [database],
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
        bind: [queue, database],
      },
    },
    routes: {
      "GET /scrape": {
        function: {
          handler: "packages/functions/src/scraper/lambda.handler",
          layers: [chromwAwsLayer],
        },
      },
      "GET /pokemon/all": "packages/functions/src/pokemon/listAll.handler",
      "GET /pokemon/{name}":
        "packages/functions/src/pokemon/fetchByName.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    QueueUrl: queue.queueUrl,
    DatabaseName: database.defaultDatabaseName,
    DatabaseSecretArn: database.secretArn,
    DatabaseIdentifier: database.clusterIdentifier,
  });
}
