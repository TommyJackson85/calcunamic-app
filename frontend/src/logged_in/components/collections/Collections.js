import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import CollectionContent from "./CollectionContent";
import AddCollection from "./AddCollection";
import AuthContext from '../../../context/auth-context';

class Collections extends PureComponent {
  state = {
    addCollectionPaperOpen: false,
    collections: []
  };
  static contextType = AuthContext;

  fetchCollections() {
    const queryCollections = {
      query: `
        query {
          usersCollections(userId:"${this.context.userId}"){
            _id
            title
            description
            date
            numbers {
              _id
              value
              link
              description
              dataType
              collectionsIn { _id }
              creator { _id }
            }
          }
        }
      `
    };
    /*
    query {
  usersCollections(userId: "5e9eece50348e61712b65b2b"){
		title
    date
    description
    creator { _id }
    numbers { 
      _id
      link
      collectionsIn {
        title
        description
      }
    }
  }
}
    */
    console.log(queryCollections.query);
    console.log(this.context);
    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(queryCollections),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.context.token}`
        }
    })
    .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          console.log("NEW ERROR!!");
          console.log(res);
          throw new Error('Failed!');
        }
        return res.json();
    })
    .then(resData => {console.log("resData");
      console.log("resData");
      console.log(resData);
      const collections = resData.data.usersCollections;
      this.setState({collections: collections});
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    const { selectCollections } = this.props;
    selectCollections();
    this.fetchCollections();
  }

  updateCollections = (updatedCollection) => {
      //for frontend only, does not interact with backend DB
      this.setState({collections: updatedCollection});
  }

  openAddCollectionModal = () => {
    this.setState({ addCollectionPaperOpen: true });
  };

  closeAddCollectionModal = () => {
    this.setState({ addCollectionPaperOpen: false });
  };

  render() {
    const { addCollectionPaperOpen, addCollectionModalOpen } = this.state;
    const {
      EmojiTextArea,
      ImageCropper,
      Dropzone,
      DateTimePicker,
      pushMessageToSnackbar,
    } = this.props;
    return (
      <Fragment>
        {addCollectionPaperOpen ? (
          <AddCollection
            onClose={this.closeAddCollectionModal}
            open={addCollectionModalOpen}
            EmojiTextArea={EmojiTextArea}
            ImageCropper={ImageCropper}
            Dropzone={Dropzone}
            DateTimePicker={DateTimePicker}
            pushMessageToSnackbar={pushMessageToSnackbar}
            updateCollections={this.updateCollections}
            collections={this.state.collections}
          />
        ) : (
          <CollectionContent
            updateCollections={this.updateCollections}
            openAddCollectionModal={this.openAddCollectionModal}
            collections={this.state.collections}
            pushMessageToSnackbar={pushMessageToSnackbar}
          />
        )}
      </Fragment>
    );
  }
}

Collections.propTypes = {
  EmojiTextArea: PropTypes.elementType,
  ImageCropper: PropTypes.elementType,
  Dropzone: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  collections: PropTypes.arrayOf(PropTypes.object).isRequired,
  pushMessageToSnackbar: PropTypes.func,
  selectCollections: PropTypes.func.isRequired
};

export default Collections;
