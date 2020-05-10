import React, { PureComponent, Fragment } from "react";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Box,
    Button,
    Grid,
    Typography,
    Avatar,
} from "@material-ui/core";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles'

import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import FolderIcon from '@material-ui/icons/Folder';
import PropTypes from "prop-types";

const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between"
  },
  panelSummary: {
    background: "#997777",
    '&:hover': {
        background: "#A38B8B",
    }
  },
  panelDetail: {
    background: "#765D5D"
  },
  panelBorder: {
    border: "0 0 2px 0",
    borderColor: "black"
  },
  yellowText: {color: "yellow"}
};
const deleteNumber = (numberId, collectionId) => () => {
  //From here, run a fetch request to delete number from database and the number ref in the collection's numbers listings. 
  //Re-update the state collections data from the collection file. 
  console.log(numberId);
  console.log(collectionId);
  return collectionId;//change later
}

const numbersList = (classes, numbers, collectionId) => {
  console.log(collectionId);
  return numbers.map((number, i) => {
      return (
        <Grid key={i}>
            <Grid item xs={12} className={classes.yellowText}>
              <Typography variant="h6" className={classes.yellowText} gutterBottom>
                  {number.value} ~ {number.dataType} ~ Found at: <a href={number.link}>{number.link}</a>
              </Typography>
              <Button variant="contained" color="secondary" onClick={deleteNumber(number._id, collectionId)}>
                  Delete
              </Button>
            </Grid>
        </Grid>
      )
    }
  )
}

const collectionsList = (props) => props.collections.map((collection, index) => {
    console.log(collection.id);
    console.log("checking collections");
    console.log(collection._id);
    console.log(index);
    const { classes } = props;

    return (
      <div key={index} className={classes.panelBorder} >
        <ExpansionPanel>
          <ExpansionPanelSummary
            className={classes.panelSummary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            borderColor="grey.500"
          >
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={1}>
                <Avatar>
                    <FolderIcon />
                </Avatar>
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h6" gutterBottom>
                    {collection.title} ~ {new Date(collection.date).toLocaleTimeString('de-DE')}
                </Typography>
            </Grid>
          </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            className={classes.panelDetail}
          >
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        {collection.description}
                    </Typography>
                </Grid>
                { (collection.numbers.length>0) ? numbersList(classes, collection.numbers, collection._id) : (<Grid item xs={12}><Typography variant="p" gutterBottom>No numbers found</Typography></Grid>) }
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                      Created At: {collection.createdAt} | Updated At: {collection.updatedAt}
                  </Typography>
                </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
});

collectionsList.propTypes = {
    classes: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
};
export default withStyles(styles)(collectionsList); 