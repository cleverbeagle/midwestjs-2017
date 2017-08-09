import { GraphQLNonNull, GraphQLString } from 'graphql';
import Document from './types';
import Documents from './Documents';

export const insertDocument = {
  type: Document,
  args: {
    owner: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(parent, args) {
    const timestamp = (new Date()).toISOString();
    const _id = Documents.insert({ ...args, createdAt: timestamp, updatedAt: timestamp });
    return { _id };
  },
};

export const updateDocument = {
  type: Document,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(parent, { _id, title, body }) {
    const timestamp = (new Date()).toISOString();
    Documents.update(_id, { $set: { title, body, updatedAt: timestamp } });
    return { _id };
  },
};

export const removeDocument = {
  type: Document,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(parent, args) {
    return Documents.remove(args);
  },
};
