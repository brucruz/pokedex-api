import { SQSEvent } from "aws-lambda";
import { PokemonFromIndexPage } from "./lambda";
import { chromiumScraper } from "src/services/chromiumScraper";

export async function handler(event: SQSEvent) {
  const records = event.Records;

  const pokemons = records.map(
    (record) => JSON.parse(record.body) as PokemonFromIndexPage
  );

  const fetchedPokemons: { name: string; id: string; types: string[] }[] = [];

  for (const pokemon of pokemons) {
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

    fetchedPokemons.push({
      name: pokemonName,
      id: pokemonId,
      types: pokemonTypes,
    });
  }
}
