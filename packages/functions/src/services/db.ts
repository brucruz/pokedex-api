import { Kysely, sql } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";

interface Database {
  pokemons: {
    id: string;
    name: string;
    types: string[];
  };
}

const db = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "postgres",
    driver: {
      database: RDS.database.defaultDatabaseName,
      secretArn: RDS.database.secretArn,
      resourceArn: RDS.database.clusterArn,
      client: new RDSData({}),
    },
  }),
});

export async function createPokemons(pokemons: Database["pokemons"][]) {
  const values = pokemons.map(({ id, name, types }) => {
    return { id, name, types: sql<string[]>`array[${sql.join(types)}]` };
  });
  const result = await db
    .insertInto("pokemons")
    .values(values)
    .onConflict((oc) => oc.column("id").doNothing())
    .execute();

  return result;
}

export async function getPokemons() {
  const pokemons = await db.selectFrom("pokemons").selectAll().execute();

  return pokemons;
}
