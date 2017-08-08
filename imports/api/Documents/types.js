import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Document',
  description: 'GraphQL type for Documents.',
  fields: {
    _id: { type: GraphQLString },
    owner: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
});
