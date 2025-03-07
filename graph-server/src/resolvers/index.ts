import { addAuthorResolver, getAuthorsResolver } from "./author";

export const resolvers = {
    Query: {
      authors: getAuthorsResolver,    
    },
    Mutation: {
      author: () => ({}),
    },
    MutationAuthor: {
      add: addAuthorResolver
    },
};