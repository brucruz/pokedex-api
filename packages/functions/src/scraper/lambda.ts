import { chromiumScraper } from "src/services/chromiumScraper";
import { ApiHandler } from "sst/node/api";
import {
  SQSClient,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
} from "@aws-sdk/client-sqs";
import { Queue } from "sst/node/queue";

export interface PokemonFromIndexPage {
  name: string;
  url: string;
}

const sqs = new SQSClient({ region: "us-east-1" });

export const handler = ApiHandler(async (_evt) => {
  const rootUrl = "https://pokemondb.net";

  const index = await chromiumScraper(`${rootUrl}/pokedex/national`);

  const main = index("main");

  const pokemonAnchors = main.find(
    "div.infocard-list.infocard-list-pkmn-lg div.infocard span.infocard-lg-data a.ent-name"
  );

  const pokemonList: PokemonFromIndexPage[] = pokemonAnchors
    .map(function () {
      const name = index(this).text() as string;
      const url = `${rootUrl}${index(this).attr("href")}`;
      return { name, url };
    })
    .get();

  console.log(`fetched a list of ${pokemonList.length} pokémons`);

  const first10Pokemon = pokemonList.slice(0, 10);

  const input: SendMessageBatchCommandInput = {
    QueueUrl: Queue.queue.queueUrl,
    Entries: first10Pokemon.map((pokemon, index) => ({
      Id: index.toString(),
      MessageBody: JSON.stringify(pokemon),
    })),
  };

  const command = new SendMessageBatchCommand(input);
  await sqs.send(command);

  return {
    statusCode: 200,
    body: `We found ${pokemonList.length} pokémons`,
  };
});
