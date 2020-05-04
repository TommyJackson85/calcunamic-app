import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Box, TextField, FormGroup, FormControlLabel, Switch, FormControl, InputLabel, MenuItem, ListSubheader, Select } from "@material-ui/core";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import AuthContext from '../../../context/auth-context';

const now = new Date();
//resource: https://goshakkk.name/array-form-inputs/
class AddCollection extends PureComponent {
  state = {
    uploadAt: now,
    loading: false,
    includeNumbers: false,
    numberFormData: [{value: 0, dataType: "Euro", link: "", Description: ""}]
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

  toggleNumberForms = () => {
    return this.setState({
      includeNumbers: !this.state.includeNumbers
    });
  };
  handleRemoveNumberForm = index => () => {
    this.setState({
      numberFormData: this.state.numberFormData.filter((data, sindex) => index !== sindex)
    });
  };
  handleAddNumberForm = () => {
    this.setState({
      numberFormData: this.state.numberFormData.concat([{value: 0, dataType: "Euro", link: "", Description: ""}])
    });
  };
  handleNumberFieldChange = (index1, keyChange) => evt => {
    const newNumberFormData = this.state.numberFormData.map((numberData, index2) => {
      if (index1 !== index2) return numberData;
      let dataSet = {...numberData}
      switch (keyChange) {
        case 'value':
          dataSet.value = evt.target.value;
          break;
        case 'link':
          dataSet.link = evt.target.value;
          break;
        case 'description':
          dataSet.description = evt.target.value;
          break;
        default:
          dataSet.dataType = evt.target.value;
      }
      return dataSet;
    });
    return this.setState({ numberFormData: newNumberFormData });
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
    const stringedNumberObjects = this.state.numberFormData.map((num)=>{
      return `{value:${num.value}, link:"${num.link}", description:"${num.description}", dataType:"${num.dataType}"}`;
    })
    const createCollection = {
      query: `
        mutation {
          createCollection(collectionInput: {title: "${title}", description: "${description}", date: "${date.toString()}"}) {
            _id
            title
            description
            numbers { 
              _id
              value
              link
              description
              dataType
            }
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };
    const createCollectionWithNumbers = {
      query:
      `mutation {
        createCollectionWithNumbers(collectionNumbersInput:{
          collectionInput:{title:"${title}", description:"${description}", date:"${date.toString()}"},
          numberInputs: [${stringedNumberObjects.join(`,`)}]  
        }) {
          _id
          title
          description
          numbers {
            _id
            value
            link
            description
            dataType
          }
        }
      }`
    }
    const mutationRequest = (this.state.includeNumbers && this.state.numberFormData.length > 0) ? createCollectionWithNumbers : createCollection;
    console.log(mutationRequest.query);
    let updatedCollections; //updated from fetch to show updated collections without having to reload collections.
    console.log(this.context.token);
    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(mutationRequest),
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
          let data;
          console.log("DATA");
          if (this.state.includeNumbers) {
              data = resData.data.createCollectionWithNumbers;
          } else {
              data = resData.data.createCollection;       
          }
          console.log(data);
          //let data = resData.data.createCollection || resData.data.createCollectionWithNumbers; 
          updatedCollections = [...this.props.collections];
          updatedCollections.push({
            _id: data._id,
            title: data.title,
            description: data.description,
            numbers: data.numbers,
            date: data.date,
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
              <p>Add an optional number value:</p>
              <FormGroup row>
                <FormControlLabel
                  control={<Switch checked={this.state.includeNumbers} onChange={this.toggleNumberForms} name="checkedA" />}
                  label="Secondary"
                />
              </FormGroup>
              {(this.state.includeNumbers) && (
                <div>
                    <Button variant="outlined" color="primary" onClick={this.handleAddNumberForm}>
                      Add another number form 
                    </Button>
                    {this.state.numberFormData.map((data, index) => (
                      <div key={index}>
                        <TextField
                          id={`number-value-field-${index}`}
                          inputRef={node => {
                            this.numValueElRef = node;
                          }}
                          label="Number Value"
                          type="number"
                          value={data.value}
                          onChange={this.handleNumberFieldChange(index, "value")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                        <TextField
                          id={`number-type-field-${index}`}
                          inputRef={node => {
                            this.numTypeElRef = node;
                          }}
                          label="Value Type"
                          value={data.dataType}
                          onChange={this.handleNumberFieldChange(index, "dataType")}
                          variant="outlined"
                        />
                        <TextField
                          id={`number-link-field-${index}`}
                          inputRef={node => {
                            this.numLinkElRef = node;
                          }}
                          label="Link reference"
                          rows={4}
                          value={data.link}
                          onChange={this.handleNumberFieldChange(index, "link")}
                          variant="outlined"
                          helperText="Add a link to data source"
                        />
                        <TextField
                          id={`number-description-field-${index}`}
                          inputRef={node => {
                            this.numDescElRef = node;
                          }}
                          value={data.description}
                          onChange={this.handleNumberFieldChange(index, "description")}
                          label="Description"
                          multiline
                          fullWidth
                          rows={4}
                          defaultValue="Default Value"
                          variant="outlined"
                        />
                        <Button variant="outlined" color="primary" onClick={this.handleRemoveNumberForm(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
