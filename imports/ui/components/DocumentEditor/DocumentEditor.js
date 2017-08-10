/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class DocumentEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        body: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        body: {
          required: 'This thneeds a body, please.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { graphql, history } = this.props;
    const existingDocument = this.props.doc && this.props.doc._id;
    const doc = {
      title: this.title.value.trim(),
      body: this.body.value.trim(),
    };

    if (!existingDocument) doc.owner = Meteor.userId(); // This is technically naughty. Ask why.
    if (existingDocument) doc._id = existingDocument;

    graphql.mutate({
      variables: doc,
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
        variables: { owner: existingDocument ? existingDocument.owner : doc.owner },
      }],
    })
    .then(({ data }) => {
      const _id = data.insertDocument ? data.insertDocument._id : data.updateDocument._id;
      const confirmation = existingDocument ? 'Document updated!' : 'Document added!';
      this.form.reset();
      Bert.alert(confirmation, 'success');
      history.push(`/documents/${_id}`);
      if (graphql.refetch) graphql.refetch();
    })
    .catch((error) => {
      console.log(error);
      Bert.alert(error, 'danger');
    });
  }

  render() {
    const { doc } = this.props;
    return (<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          ref={title => (this.title = title)}
          defaultValue={doc && doc.title}
          placeholder="Oh, The Places You'll Go!"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Body</ControlLabel>
        <textarea
          className="form-control"
          name="body"
          ref={body => (this.body = body)}
          defaultValue={doc && doc.body}
          placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        {doc && doc._id ? 'Save Changes' : 'Add Document'}
      </Button>
    </form>);
  }
}

DocumentEditor.defaultProps = {
  doc: { title: '', body: '' },
  graphql: {},
};

DocumentEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
  graphql: PropTypes.object,
};

export default DocumentEditor;
