import { GraphQLString } from 'graphql';
import { Meteor } from 'meteor/meteor';
import User from './types';

export default {
  type: User,
  args: {
    _id: {
      name: '_id',
      type: GraphQLString,
    },
  },
  resolve(parent, args) {
    return Meteor.users.findOne(args);
  },
};
