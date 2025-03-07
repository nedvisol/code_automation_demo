import { Author } from "../generated/graphql";
import { getAuthors } from '../dao/author';

export const getAllAuthors: () => Promise<Author[]> = async () => {
  return await getAuthors();
}