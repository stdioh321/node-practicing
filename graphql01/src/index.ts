import express = require("express");
import { graphqlHTTP } from "express-graphql";

import { AppDataSource } from "./data-source";
import { schema } from "./schema";

const app = express();

/**
 * Initializes the server by setting up the GraphQL endpoint and listening on a
 * port. If the server fails to initialize, it logs an error message.
 */
async function main() {
  try {
    await AppDataSource.initialize();

    app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        graphiql: true,
      })
    );

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("🚨 Error initializing the server", error);
  }
}

main();
