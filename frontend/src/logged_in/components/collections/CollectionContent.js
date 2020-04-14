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
 
function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
};

class CollectionContent extends PureComponent {
  state = {
    collections: [],
    page: 0,
    deleteCollectionDialogOpen: false,
    deleteCollectionLoading: false,
    dense: true,
    secondary: true
  };
  static contextType = AuthContext;
  rowsPerPage = 25;

  fetchCollections = () => {
    const queryCollections = {
      query: `
        query {
          collections {
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
    .then(resData => {
      console.log(resData);
      const collections = resData.data.collections;
      this.setState({collections: collections});
    })
    .catch(err => {
      console.log(err);
    });
  }
  componentDidMount() {
    this.fetchCollections();
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

  /*printImageGrid = () => {
    const options = [];
    options.push({
      name: "Delete",
      onClick: this.onDelete,
      icon: <DeleteIcon />
    });
    const { collections } = this.props;
    const { page } = this.state;
    if (collections.length > 0) {
      return (
        <Box p={1}>
          <Grid container spacing={1}>
            {collections
              .slice(
                page * this.rowsPerPage,
                page * this.rowsPerPage + this.rowsPerPage
              )
              .map(element => (
                <Grid item xs={6} sm={4} md={3} key={element.id}>
                  <SelfAligningImage
                    src={element.src}
                    title={element.name}
                    timeStamp={element.timestamp}
                    options={options}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      );
    }
    return (
      <Box m={2}>
        <HighlightedInformation>
          No collections added yet. Click on &quot;NEW&quot; to create your first one.
        </HighlightedInformation>
      </Box>
    );
  };*/

  render() {
    const { page, deleteCollectionDialogOpen, deleteCollectionLoading } = this.state;
    const { openAddCollectionModal, collections, classes } = this.props;
    //{this.printImageGrid()} this was removed from above <TablePagination>
    const collectionsList = this.state.collections.map(collection => {
      return (
        <ListItem key={collection._id}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={collection.title}
            secondary={collection.description}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
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
            <List dense={this.state.dense}>
              {collectionsList}
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                    secondary={this.state.secondary ? 'Secondary text' : null}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>,
              )}
            </List>
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
