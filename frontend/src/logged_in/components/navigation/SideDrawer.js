import React from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  Box,
  withStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AuthContext from "../../../context/auth-context";

const drawerWidth = 240;

const styles = {
  toolbar: {
    minWidth: drawerWidth
  }
};

const SideDrawer = (props) => (
  <AuthContext.Consumer>
    {context => {
      const { classes, onClose, open } = props;
        return (
            <Drawer anchor="right" open={open} variant="temporary" onClose={onClose}>
              <Toolbar disableGutters className={classes.toolbar}>
                <Box
                  pl={3}
                  pr={3}
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  alignItems="center"
                >
                  <Typography variant="h6">A Sidedrawer</Typography>
                  <IconButton
                    onClick={onClose}
                    color="primary"
                    aria-label="Close Sidedrawer"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Toolbar>
              <Divider />
              <Typography variant="h6">Logout</Typography>
                  <IconButton
                    onClick={context.logout}
                    color="primary"
                    aria-label="Close Sidedrawer"
                  >
                    <CloseIcon />
                </IconButton>
            </Drawer>
        )  
  }}  
  </AuthContext.Consumer>
)

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(SideDrawer);
