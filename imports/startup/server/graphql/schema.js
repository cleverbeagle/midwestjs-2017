import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { document, documents } from '../../../api/Documents/resolvers';
import user from '../../../api/Users/resolvers';
import { insertDocument, updateDocument, removeDocument } from '../../../api/Documents/mutations';

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query for the application.',
  fields: {
    document,
    documents,
    user,
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutations for the application.',
  fields: {
    insertDocument,
    updateDocument,
    removeDocument,
  },
});

//
// const subscription = new GraphQLObjectType({
//   name: 'Subscription',
//   description: 'Subscriptions for the application.',
// });

export default new GraphQLSchema({
  query,
  mutation,
  // subscription,
});
