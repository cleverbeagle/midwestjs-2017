import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (documentId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        history.push('/documents');
      }
    });
  }
};

const renderDocument = (doc, match, history) => (doc ? (
  <div className="ViewDocument">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewDocument = ({ data: { loading, document }, match, history }) => (
  !loading ? renderDocument(document, match, history) : <Loading />
);

ViewDocument.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default graphql(gql`
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
})(ViewDocument);
