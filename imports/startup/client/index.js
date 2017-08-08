import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App/App';

import '../../ui/stylesheets/app.scss';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: Meteor.settings.public.graphql.uri }),
});

Meteor.startup(() => render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('react-root'),
));
