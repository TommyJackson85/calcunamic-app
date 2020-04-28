import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  TablePagination,
  Divider,
  Toolbar,
  Typography,
  Button,
  Paper,
  withStyles,
  Avatar,
  IconButton,
  List,
  ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction
} from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


//import DeleteIcon from "@material-ui/icons/Delete";
//import SelfAligningImage from "../../../shared/components/SelfAligningImage";
//import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AuthContext from '../../../context/auth-context';

const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between"
  }
};
 
/*function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
};*/

class CollectionContent extends PureComponent {
  state = {
    page: 0,
    deleteCollectionDialogOpen: false,
    deleteCollectionLoading: false,
    dense: true,
    secondary: true
  };

  static contextType = AuthContext;
  rowsPerPage = 25;

  componentDidMount() {
    console.log("its working");
  }
  closeDeleteCollectionDialog = () => {
    this.setState({
      deleteCollectionDialogOpen: false,
      deleteCollectionLoading: false
    });
  };

  deleteCollection = () => {
    const { pushMessageToSnackbar } = this.props;
    this.setState({ deleteCollectionLoading: true });
    setTimeout(() => {
      this.setState({
        deleteCollectionLoading: false,
        deleteCollectionDialogOpen: false
      });
      pushMessageToSnackbar({
        text: "Your scheduled collection has been deleted"
      });
    }, 1500);
  };

  onDelete = () => {
    this.setState({
      deleteCollectionDialogOpen: true
    });
  };

  handleChangePage = (__, page) => {
    this.setState({ page });
  };
  handleChange = () => {

  }
  render() {
    const { page, deleteCollectionDialogOpen, deleteCollectionLoading } = this.state;
    const { openAddCollectionModal, collections, classes } = this.props;
    //{this.printImageGrid()} this was removed from above <TablePagination>
    console.log(this.props.collections);

    const numbersList = (numbers) => {
      return numbers.map((number, i) => {
        return (
          <Typography key={i}>
            <p>{number.value} ~ {number.dataType} ~ Found at: <a href={number.link}></a></p>
            <hr/>
            <p>Created At: {number.createdAt} | Updated At: {number.updatedAt}</p>
          </Typography>
        )
      })
    }

    const collectionsList = this.props.collections.map((collection, index) => {
      console.log("checking collections");
      console.log(index);
      return (
        <div key={index}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                <Avatar>
                  <FolderIcon />
                </Avatar>
                {collection.title} ~ {new Date(collection.date).toLocaleTimeString('de-DE')}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <p>{collection.description}</p>
              </Typography>
              { (collection.numbers.length>0) ? numbersList(collection.numbers) : <p>No numbers found</p> }
              <br />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )
    });
    return (
      <Paper>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Your Collections</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={openAddCollectionModal}
            disableElevation
          >
            Add Collection
          </Button>
        </Toolbar>
        <Divider />
        <Typography variant="h6" className={classes.title}>
            Avatar with text and icon
        </Typography>
        <div className={classes.demo}>
          { (collectionsList.length > 0) ? collectionsList : ( 
          <div key={0}>
            <p>No collections found. <em onClick={openAddCollectionModal}>Click hear</em> to start your first data collection!</p>
          </div>
          ) }
        </div>
        <TablePagination
          component="div"
          count={collections.length}
          rowsPerPage={this.rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          classes={{
            select: classes.dNone,
            selectIcon: classes.dNone,
            actions: collections.length > 0 ? classes.dBlock : classes.dNone,
            caption: collections.length > 0 ? classes.dBlock : classes.dNone
          }}
          labelRowsPerPage=""
        />
        <ConfirmationDialog
          open={deleteCollectionDialogOpen}
          title="Confirmation"
          content="Do you really want to delete the collection?"
          onClose={this.closeDeleteCollectionDialog}
          loading={deleteCollectionLoading}
          onConfirm={this.deleteCollection}
        />
      </Paper>
    );
  }
}

CollectionContent.propTypes = {
  openAddCollectionModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  collections: PropTypes.arrayOf(PropTypes.object).isRequired,
  pushMessageToSnackbar: PropTypes.func
};

export default withStyles(styles)(CollectionContent);
