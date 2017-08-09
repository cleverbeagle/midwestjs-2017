import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import DocumentEditor from '../../components/DocumentEditor/DocumentEditor';

const NewDocument = ({ history, mutate }) => (
  <div className="NewDocument">
    <h4 className="page-header">New Document</h4>
    <DocumentEditor history={history} graphql={{ mutate }} />
  </div>
);

NewDocument.propTypes = {
  history: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default graphql(gql`
  mutation insertDocument($owner: String!, $title: String!, $body: String!) {
    insertDocument(owner: $owner, title: $title, body: $body) {
      _id,
    }
  }
`)(NewDocument);
