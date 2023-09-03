import { getPokemons } from "src/services/db";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const pokemons = await getPokemons();

  return {
    statusCode: 200,
    body: JSON.stringify({
      pokemons,
      count: pokemons.length,
    }),
  };
});
