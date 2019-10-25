import { todos } from '../dataResources/mockData';
import { IResolverObject, IResolvers } from 'graphql-tools';

export const resolvers: IResolvers = {
  Query: {
    todos: (_root, args) => todos.filter(todo => todo.user === args.id),
  } as IResolverObject,
};
