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
      currentUser: context //should be null and later set to type (MongooseUser.jsObject) by LoginRegister
    }

    this.parentCallback = this.parentCallback.bind(this);
  }
  componentDidMount() {
    console.log("PhotoShare::componentDIDmount::this.state.currentUser", this.state.currentUser)
  }
  parentCallback(fromChild) {
    //A callback that sets this.state.currentUser
    // should be called by LoginRegister (login) and TopBar (Logout)

    // console.log("FROM CHILD: ", fromChild);
    this.setState({
      currentUser: fromChild
    })
  }
  render() {
    // console.log("PhotoShare::render::this.state.currentUser: ", this.state.currentUser);
    return (
      <LoginContext.Provider value={this.state.currentUser} style={{background: "black"}}>
      <HashRouter>
          <Grid container spacing={8} style={{background: "black", minHeight: '100vh'}} alignItems="center" direction={this.state.currentUser ?  null : "column" } justify={this.state.currentUser ? null: "center" }>
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
            {
              this.state.currentUser && <Grid item sm={3}>
                <Paper  className="cs142-main-grid-item" style={{background: "#55b0c9"}}>
                  {
                     <UserList/>
                  }
                </Paper>
              </Grid>
            }
            <Grid item sm={9}  width={1}>
              <Paper className="cs142-main-grid-item" style={{background: "#55b0c9"}}>
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
                        // Before login, this.state.currentUser is null
                        // After login, we update this.state.currentUser using a parentCallback
                        // Since, PhotoShare is the root component, the entire app
                        //  will have acces to this.state.currentUser via LoginContext

                        // :mode \in {login, register}
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
      </HashRouter>
      </LoginContext.Provider>
    );
  }
}


ReactDOM.render(
  <PhotoShare/>,
  document.getElementById('photoshareapp'),
);
