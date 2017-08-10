import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = ({ _id, owner }, history, mutate) => {
  if (confirm('Are you sure? This is permanent!')) {
    mutate({
      variables: {
        _id,
      },
      refetchQueries: [{
        query: gql`
          query($owner: String!) {
            documents(owner: $owner) {
              _id,
              title,
              createdAt,
              updatedAt,
            },
          },
        `,
        variables: { owner },
      }],
    })
    .then(() => {
      Bert.alert('Document deleted!', 'success');
      history.push('/documents');
    })
    .catch((error) => {
      Bert.alert(error.message, 'danger');
    });
  }
};

const renderDocument = (doc, match, history, mutate) => (doc ? (
  <div className="ViewDocument">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc, history, mutate)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewDocument = ({ data: { loading, document }, match, history, mutate }) => (
  !loading ? renderDocument(document, match, history, mutate) : <Loading />
);

ViewDocument.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default compose(
  graphql(gql`
    query($_id: String!) {
      document(_id: $_id) {
        _id,
        owner,
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
    mutation remomveDocument($_id: String!) {
      removeDocument(_id: $_id) {
        _id
      }
    }
  `),
)(ViewDocument);
