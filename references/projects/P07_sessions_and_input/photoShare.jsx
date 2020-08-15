import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import LoginRegister from './components/loginRegister/LoginRegister';
import {LoginContext} from './components/loginContext/LoginContext';

class PhotoShare extends React.Component {
  static contextType = LoginContext;
  constructor(props, context) {
    super(props);

    this.state = {
      currentUser: context
    }

    this.parentCallback = this.parentCallback.bind(this);
  }
  componentDidMount() {
    this.setState({
      currentUser: this.context
    })
  }
  parentCallback(fromChild) {
    // console.log("FROM CHILD: ", fromChild);
    this.setState({
      currentUser: fromChild
    })
  }
  render() {
    // console.log("PhotoShare::render::this.state.currentUser: ", this.state.currentUser);
    return (
      <LoginContext.Provider value={this.state.currentUser}>
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>\
              <Route path="/*"
                    render={
                      (props) => {
                        props.parentCallback = this.parentCallback;
                        return <TopBar {...props} />; 
                      }
                    }
              />
            </Grid>
            <div className="cs142-main-topbar-buffer"/>
            <Grid item sm={3}>
              <Paper  className="cs142-main-grid-item">
                {
                  this.state.currentUser && <UserList />
                }
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                <React.Fragment> 
                {
                  this.state.currentUser ?
                  (
                    <div>
                    <Route path="/users/:userId"
                      render={ props => <UserDetail {...props} /> }
                    />
                    <Route path="/photos/:userId"
                      render ={ props => <UserPhotos {...props} /> }
                    />
                    </div>
                  )
                  :
                  <Redirect path="/*" to="/login-register/login"/>
                }
                {
                  this.state.currentUser ?
                  <Redirect path="/login-register/login" to={"/users/" + this.state.currentUser._id} />
                  :
                  <Route path="/login-register/:mode"
                    render={
                      (props) => {
                        props.parentCallback = this.parentCallback;
                        return <LoginRegister {...props} />; 
                      }
                    }
                  />
                }
                </React.Fragment>
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
      </LoginContext.Provider>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
