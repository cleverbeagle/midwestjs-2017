import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import DocumentEditor from '../../components/DocumentEditor/DocumentEditor';
import NotFound from '../NotFound/NotFound';

const EditDocument = ({ data: { document, refetch }, history, mutate }) => (document ? (
  <div className="EditDocument">
    <h4 className="page-header">{`Editing "${document.title}"`}</h4>
    <DocumentEditor doc={document} history={history} graphql={{ mutate, refetch }} />
  </div>
) : <NotFound />);

EditDocument.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default compose(
  graphql(gql`
    query($_id: String!) {
      document(_id: $_id) {
        _id,
        title,
        body,
        createdAt,
        updatedAt,
      },
    },
  `, {
    options: ({ match: { params: { _id } } }) => ({
      pollInterval: 10000,
      variables: {
        _id,
      },
    }),
  }),
  graphql(gql`
    mutation updateDocument($_id: String!, $title: String!, $body: String!) {
      updateDocument(_id: $_id, title: $title, body: $body) {
        _id,
      }
    }
  `),
)(EditDocument);
