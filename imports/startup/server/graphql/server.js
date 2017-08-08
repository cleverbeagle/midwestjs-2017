import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

// We use cors() as a middleware here because in Meteor, we're running our GraphQL server on port
// 4000 and our app on port 3000 (technically a cross-domain request). This shuts the browser up.
// Inside of a vanilla Node application using Express directly, this shouldn't be a concern.
const app = express().use('*', cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000);
