import { Author, MutationAuthorResolvers, MutationResolvers, QueryResolvers } from "../generated/graphql";
import { createAuthor, getAuthors, getAuthorsById } from '../dao/author';

export const getAuthorsResolver:QueryResolvers['authors'] = async () => {
  return await getAuthors();
}

export const addAuthorResolver:MutationAuthorResolvers['add'] = async (parent, args, context, info) => {
  const input = args.param;

  const id = await createAuthor(input);

  return await getAuthorsById(id);
};