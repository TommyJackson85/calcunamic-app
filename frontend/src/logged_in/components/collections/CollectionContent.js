import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import CollectionContentList from "./CollectionContentList";
import { makeStyles } from '@material-ui/core/styles'
import {
  TablePagination,
  Divider,
  Toolbar,
  Typography,
  Button,
  Paper,
  withStyles,
  Avatar,
} from "@material-ui/core";


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
  },
};

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

  render() {
    const classes = styles;

    const { page, deleteCollectionDialogOpen, deleteCollectionLoading } = this.state;
    const { openAddCollectionModal, collections } = this.props;
    //{this.printImageGrid()} this was removed from above <TablePagination>
    console.log(this.props.collections);

    return (
      <Paper>
        <Toolbar>
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
        <Typography variant="h6">
            Avatar with text and icon
        </Typography>
        <div>
          { (this.props.collections.length > 0) ? <CollectionContentList collections={this.props.collections} /> : ( 
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
