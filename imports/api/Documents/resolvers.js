import { GraphQLList, GraphQLString } from 'graphql';
import Documents from './Documents';
import Document from './types';

export const document = {
  type: Document,
  args: {
    _id: {
      name: '_id',
      type: GraphQLString,
    },
  },
  resolve(parent, args) {
    return Documents.findOne(args); // effectively, Documents.findOne({ _id: ... });
  },
};

export const documents = {
  type: new GraphQLList(Document),
  args: {
    owner: {
      name: 'owner',
      type: GraphQLString,
    },
  },
  resolve(parent, args) {
    return Documents.find(args).fetch();
  },
};
