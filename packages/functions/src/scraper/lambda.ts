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

  const first10Pokemon = pokemonList.slice(0, 10);

  for (const pokemon of first10Pokemon) {
    console.log(`fetching ${pokemon.name} from ${pokemon.url}`);

    const $ = await chromiumScraper(pokemon.url);

    const pokemonName = $("main h1").text();

    const pokemonTabIndex = $(
      "main div.tabset-basics div.sv-tabs-tab-list a.sv-tabs-tab.active"
    ).attr("href");

    const pokemonPokedexData = $(
      `main div.tabset-basics div.sv-tabs-panel-list div${pokemonTabIndex} table.vitals-table:first-of-type tbody`
    );
    const pokemonId = pokemonPokedexData
      .find("tr:first-of-type td strong")
      .text();

    const pokemonTypes = pokemonPokedexData
      .find("tr:nth-of-type(2) td a.type-icon")
      .map(function () {
        return $(this).text();
      })
      .get();

    console.log(
      `fetched ${pokemonName} with id ${pokemonId} and types ${pokemonTypes}`
    );
  }

  return {
    statusCode: 200,
    body: `We found ${pokemonList.length} pokémons`,
  };
});
