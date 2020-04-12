import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  TablePagination,
  Divider,
  Toolbar,
  Typography,
  Button,
  Paper,
  withStyles
} from "@material-ui/core";
//import DeleteIcon from "@material-ui/icons/Delete";
//import SelfAligningImage from "../../../shared/components/SelfAligningImage";
//import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";

const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between"
  }
};

class CollectionContent extends PureComponent {
  state = {
    page: 0,
    deleteCollectionDialogOpen: false,
    deleteCollectionLoading: false
  };

  rowsPerPage = 25;

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
        <h1>Fantastic TOOLBAR!</h1>
        <Divider />
        {this.printImageGrid()}
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
