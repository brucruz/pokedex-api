import { countAllPokemons, getPokemons } from "src/services/db";
import { ApiHandler } from "sst/node/api";

interface QueryParams {
  limit?: string;
  offset?: string;
}

export const handler = ApiHandler(async (_evt) => {
  const { limit = "50", offset = "0" } =
    (_evt.queryStringParameters as QueryParams) || {};

  const pokemons = await getPokemons(parseInt(limit), parseInt(offset));
  const totalPokemon = await countAllPokemons();

  return {
    statusCode: 200,
    body: JSON.stringify({
      pokemons,
      count: pokemons.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      totalPokemon,
    }),
  };
});
