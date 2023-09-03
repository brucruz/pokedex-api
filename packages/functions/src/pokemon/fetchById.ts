import { getPokemonById, getPokemonByName } from "src/services/db";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const id = _evt.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing id parameter" }),
    };
  }

  const pokemon = await getPokemonById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(pokemon),
  };
});
