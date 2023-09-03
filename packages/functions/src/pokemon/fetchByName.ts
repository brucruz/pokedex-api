import { getPokemonByName } from "src/services/db";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const name = _evt.pathParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing name parameter" }),
    };
  }

  const pokemon = await getPokemonByName(name);

  return {
    statusCode: 200,
    body: JSON.stringify(pokemon),
  };
});
