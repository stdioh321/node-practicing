import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Load GraphQL files
const typeDefFiles = readdirSync(join(__dirname))
  .filter((file) => file.endsWith(".graphql"))
  .map((file) => readFileSync(join(__dirname, file), "utf-8"));

const typeDefs = mergeTypeDefs(typeDefFiles);

// Load resolvers dynamically
const resolverFiles = readdirSync(join(__dirname, "../resolvers")).filter(
  (file) => file.endsWith(".resolver.ts") || file.endsWith(".resolver.js")
);

function loadResolver(file: string) {
  const filePath = join(__dirname, "../resolvers", file);
  const resolver = require(filePath);

  if (resolver.default) {
    console.log(`Found default export in resolver file: ${filePath} 📦`);
    return resolver.default;
  }

  throw new Error(
    `No default export found in resolver file: ${filePath} 🤔.
Make sure your resolver is exported as default. 
- Named exports must be named 'resolvers' 📜
- Default export should be named 'default' 🔥
- Classes must be exported as default 👩‍🎤
- Functions must be exported as default 🎉`
  );
}

const resolvers = resolverFiles.map(loadResolver);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
