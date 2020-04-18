import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Box, TextField } from "@material-ui/core";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import AuthContext from '../../../context/auth-context';

const now = new Date();

class AddCollection extends PureComponent {
  state = {
    uploadAt: now,
    loading: false,
  };
  static contextType = AuthContext;

  constructor(props) { 
    super(props);
    this.titleElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  } 

  onChangeUploadAt = uploadAt => {
    this.setState({
      uploadAt
    });
  };

  showCollections = () => {

  }

  handleUpload = () => {
    const { pushMessageToSnackbar, onClose } = this.props;
    this.setState({ loading: true });
    console.log(this.titleElRef.current);
    console.log(this.descriptionElRef.current);
    const title = this.titleElRef.value;
    const description = this.descriptionElRef.value;
    const date = new Date().toISOString();
    const numbers = 5.55;
    if (title.trim().length === 0 || description.trim().length === 0){
        return;
    }
    const collection = {title, description, numbers, date}
    console.log(collection);
    const createCollection = {
      query: `
        mutation {
          createCollection(collectionInput: {title: "${title}", description: "${description}", numbers: ${numbers} date: "${date}"}) {
            _id
            title
            description
            numbers
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };
    let updatedCollections; //updated from fetch to show updated collections without having to reload collections.
    console.log(this.context.token);
    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(createCollection),
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
      .then(resData => {
        console.log(resData);
        console.log("this.state.collections");
        console.log(this.props.collections);
        //folling setState call should add the object so it doesn't need to reload collections.
         
          updatedCollections = [...this.props.collections];
          updatedCollections.push({
            _id: resData.data.createCollection._id,
            title: resData.data.createCollection.title,
            description: resData.data.createCollection.description,
            numbers: resData.data.createCollection.numbers,
            date: resData.data.createCollection.date,
            creator: {
              _id: this.context.userId
            }
          });
          console.log("updatedCollections");
          console.log(updatedCollections);
          this.props.updateCollections(updatedCollections);
          
      })
      .catch(err => {
        console.log(err);
      });

    setTimeout(() => {
      pushMessageToSnackbar({
        text: "Your collection has been uploaded"
      });
      onClose();
      }, 1500);
    };

  render() {
    const { loading } = this.state;
    const {
      onClose,
      updatedCollections,
    } = this.props;

    return (
      <Fragment>
        <ActionPaper
          helpPadding
          maxWidth="md"
          content={
            <div>
              <TextField
                label="Title"
                id="outlined-margin-none"
                inputRef={node => {
                  this.titleElRef = node;
                }}
                defaultValue="Collection Name"
                fullWidth
                helperText="Some important text"
                variant="outlined"
              />
              <TextField
                id="outlined-multiline-static"
                inputRef={node => {
                  this.descriptionElRef = node;
                }}
                label="Description"
                multiline
                fullWidth
                rows={4}
                defaultValue="Default Value"
                variant="outlined"
              />
            </div>
          }
          actions={
            <Fragment>
              <Box mr={1}>
                <Button onClick={onClose} disabled={loading}>
                  Back
                </Button>
              </Box>
              {this.context.token && (
                <Button
                    onClick={this.handleUpload}
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                  >
                    Upload {loading && <ButtonCircularProgress />}
                </Button>
              )}
            </Fragment>
          }
        />
      </Fragment>
    );
  }
}

AddCollection.propTypes = {
  pushMessageToSnackbar: PropTypes.func,
  onClose: PropTypes.func,
  Dropzone: PropTypes.elementType,
  EmojiTextArea: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  ImageCropper: PropTypes.elementType
};

export default AddCollection;
