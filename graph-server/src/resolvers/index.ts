import { getAllAuthors } from "./author";

export const resolvers = {
    Query: {
      authors: async () => getAllAuthors()
    },
};
