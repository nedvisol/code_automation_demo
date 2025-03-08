import { Author, MutationAuthorResolvers, MutationResolvers, QueryResolvers } from "../generated/graphql";
import { createAuthor, getAuthors, getAuthorById } from '../dao/author';

export const getAuthorsResolver:QueryResolvers['authors'] = async () => {
  const results = await getAuthors();
  console.log(results);
  return results;
}

export const addAuthorResolver:MutationAuthorResolvers['add'] = async (parent, args, context, info) => {
  const input = args.param;

  const id = await createAuthor(input);

  return await getAuthorById(id);
};