import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (_id, history, mutate) => {
  if (confirm('Are you sure? This is permanent!')) {
    mutate({
      variables: {
        _id,
      },
    })
    .then(() => {
      Bert.alert('Document deleted!', 'success');
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
          <Button onClick={() => handleRemove(doc._id, history, mutate)} className="text-danger">
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
  refetch: PropTypes.func.isRequired,
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
    mutation remomveDocument($_id: String!) {
      removeDocument(_id: $_id) {
        _id
      }
    }
  `),
)(ViewDocument);
