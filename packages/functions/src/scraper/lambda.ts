import { chromiumScraper } from "src/services/chromiumScraper";
import { ApiHandler } from "sst/node/api";

export interface PokemonFromIndexPage {
  name: string;
  url: string;
}

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

  return {
    statusCode: 200,
    body: `We found ${pokemonList.length} pokémons`,
  };
});
