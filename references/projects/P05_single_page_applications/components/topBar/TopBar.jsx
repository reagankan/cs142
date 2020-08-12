import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      data: []
    }

    this.getSuccess = this.getSuccess.bind(this);
    this.getError = this.getError.bind(this);
  }
  getSuccess(value) {
    //calls to setState will invoke render() again.
    this.setState( {
      isLoaded: true,
      data: value.data
    } );
    console.log("getSuccess():", value);
  }
  getError(error) {
    //calls to setState will invoke render() again.
    this.setState( {
      isLoaded: true,
      error: error
    } );
  }
  componentDidMount() {
    // called after initial mount to DOM. Thus, only called once.
    // see React Component Lifecyle.
    let fetchPromise = fetchModel("/test/info");
    fetchPromise.then(this.getSuccess, this.getError);
    console.log("state.data DidMount:", this.state.data);
  }
  render() {
    // verify render is called after setState invocation.
    console.log("render called");

    // get location info from url.
    let url = this.props.match.url;
    let uIndex = url.search(/\/photos\//i);
    let pIndex = url.search(/\/users\//i);

    // check FETCH status.
    const { error, isLoaded, data } = this.state;

    console.log(url);
    console.log(error, isLoaded, data);

    // set context based on 1. url location 2. FETCH status.
    let context = "";
    if (uIndex === -1 && pIndex === -1) {
      if (error || !isLoaded) {
          context = "Home Page";
      } else {
          console.log("state.data render", data);
          context = "Home Page " + data.__v;
      }
    } else {
      let id = url.substring(url.lastIndexOf("/")+1);
      let userModel = window.cs142models.userModel(id);
      let first_name = userModel.first_name;
      let last_name = userModel.last_name;
      let name = first_name + " " + last_name;
      context = (uIndex === -1) ? name : name + "'s Photos";
    }
    
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="cs142-topbar-flexbox">
          <Typography variant="h5" color="inherit" className="cs142-topbar-flexitem name">
            Reagan Kan&apos;s FB
          </Typography>

          <Typography variant="h5" color="inherit" className="cs142-topbar-flexitem context">
            {
              context
            }
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
