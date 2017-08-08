import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { Meteor } from 'meteor/meteor';
import Document from '../Documents/types';
import Documents from '../Documents/Documents';

export default new GraphQLObjectType({
  name: 'User',
  description: 'GraphQL type for Users.',
  fields: {
    _id: { type: GraphQLString },
    emailAddress: {
      type: GraphQLString,
      resolve({ _id }) {
        const user = Meteor.users.findOne(_id);
        return user.emails[0].address;
      },
    },
    fullName: {
      type: GraphQLString,
      resolve({ _id }) {
        const user = Meteor.users.findOne(_id);
        return `${user.profile.name.first} ${user.profile.name.last}`;
      },
    },
    firstName: {
      type: GraphQLString,
      resolve({ _id }) {
        const user = Meteor.users.findOne(_id);
        return user.profile.name.first;
      },
    },
    lastName: {
      type: GraphQLString,
      resolve({ _id }) {
        const user = Meteor.users.findOne(_id);
        return user.profile.name.last;
      },
    },
    totalDocuments: {
      type: GraphQLInt,
      resolve(user) {
        return Documents.find({ owner: user._id }).count();
      },
    },
    documents: {
      type: new GraphQLList(Document),
      resolve(user) {
        return Documents.find({ owner: user._id }).fetch();
      },
    },
  },
});
