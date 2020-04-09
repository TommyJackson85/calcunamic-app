import React, { Component, Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AuthContext from "./context/auth-context";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import * as serviceWorker from "./serviceWorker";
import Pace from "./shared/components/Pace";

const LoggedInComponent = lazy(() => import("./logged_in/components/Main"));

const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));

class App extends Component {
  state = {
    token: null,
    userId: null
  }
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId, })
  }
  logout = () => {
    this.setState({ token: null, userId: null, })
  }
  
  render() {
    console.log(this.state.token);
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <Pace color={theme.palette.primary.light} />
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.
            }}
          >
            <Suspense fallback={<Fragment />}>
                <Switch>
                  {!this.state.token && <Redirect from="/c" to="/" exact />}
                  {this.state.token && <Redirect from="/" to="/c" exact />}
                  {!this.state.token && (
                    <Route path="/">
                       <LoggedOutComponent />
                    </Route>
                  )}
                  {this.state.token && (
                    <Route path="/c">
                      <LoggedInComponent />
                    </Route>
                  )}
                </Switch>
            </Suspense>
          </AuthContext.Provider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
}
}

serviceWorker.register();

export default App;
