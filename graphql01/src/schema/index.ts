import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { postResolver } from "../resolvers/post.resolver";
import { userResolver } from "../resolvers/user.resolver";

const typeDefFiles = readdirSync(join(__dirname))
  .filter((file) => file.endsWith(".graphql"))
  .map((file) => readFileSync(join(__dirname, file), "utf-8"));

const typeDefs = mergeTypeDefs(typeDefFiles);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [userResolver, postResolver],
});


