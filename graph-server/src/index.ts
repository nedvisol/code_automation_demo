import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers';
import { readFileSync } from 'fs';
import { join } from 'path';
import { initDatabase } from './dao';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

if (process.argv.includes('--init')) {
    initDatabase();
}

const serverStart = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
      
    console.log(`🚀  Server ready at: ${url}`);
}

serverStart();

