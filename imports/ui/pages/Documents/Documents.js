import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Loading from '../../components/Loading/Loading';

import './Documents.scss';

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
      }
    });
  }
};

const Documents = ({ data: { loading, documents }, match, history }) => (!loading ? (
  <div className="Documents">
    <div className="page-header clearfix">
      <h4 className="pull-left">Documents</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Document</Link>
    </div>
    {!loading && documents.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Last Updated</th>
          <th>Created</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {documents.map(({ _id, title, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >View</Button>
            </td>
            <td>
              <Button
                bsStyle="danger"
                onClick={() => handleRemove(_id)}
                block
              >Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No documents yet!</Alert>}
  </div>
) : <Loading />);

Documents.propTypes = {
  data: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default graphql(gql`
  query($owner: String!) {
    documents(owner: $owner) {
      _id,
      title,
      createdAt,
      updatedAt,
    },
  },
`, {
  options: ({ userId }) => ({
    pollInterval: 10000,
    variables: {
      owner: userId,
    },
  }),
})(Documents);
