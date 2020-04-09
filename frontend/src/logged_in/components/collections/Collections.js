import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import CollectionContent from "./CollectionContent";
import AddCollection from "./AddCollection";

class Collections extends PureComponent {
  state = {
    addCollectionPaperOpen: false
  };

  componentDidMount() {
    const { selectCollections } = this.props;
    selectCollections();
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
      collections
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
          />
        ) : (
          <CollectionContent
            openAddCollectionModal={this.openAddCollectionModal}
            collections={collections}
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
