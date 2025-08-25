import { readFileSync } from "fs";
import { join } from "path";
import { userResolver } from "./resolvers/userResolver";
import { postResolver } from "./resolvers/postResolver";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = readFileSync(
  join(__dirname, "schema/schema.graphql"),
  "utf-8"
);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [userResolver, postResolver],
});
