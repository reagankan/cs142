import React from 'react';
import {Link} from 'react-router-dom';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';

import './TopBar.css';

import {LoginContext} from '../loginContext/LoginContext';

import axios from 'axios';


/**
 * Define TopBar, a React component of CS142 project #5
 */
class TopBar extends React.Component {
  static contextType = LoginContext;
  constructor(props, context) {
    //WEIRD!! https://github.com/facebook/react/issues/6598
    //this.context is only available in React version 16.3.0+
    // also only in LIFECYCLE methods. which does NOT include the constructor.
    //
    //Solution
    /*
    1. set a static variable `contextType` to the context class
      e.g. static contextType = LoginContext; //remember to import LoginContext
    2. pass in as argument to constructor and set `this.context`
      e.g. this.state.context = context; //TODO: refactor to this.
      e.g. this.context = context;
    
    */
    super(props);

    this.context = context;
    console.log("TopBar::constructor:context: ", this.context, context, React.version);

    // Project 5, Problem #2: use lib/fetchModel to interface XMLHttpResponse
    // Project 6, Problem #2: use axios ... 
    this.state = {
      currUrl: this.props.match.url,

      versionIsLoaded: false,
      userIsLoaded: false,

      error: null,

      version: null,
      userModel: null
    }

    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);

    this.handleLogout = this.handleLogout.bind(this);
  }
  handleSuccess(value) {
    //calls to setState will invoke render() again.
    const isTestSchema = Object.keys(value.data).includes("__v");
    if (isTestSchema) {
      this.setState( {
        versionIsLoaded: true,
        version: value.data.__v
      } );
    } else {
      this.setState( {
        userIsLoaded: true,
        userModel: value.data
      } );
    }
  }
  handleError(error) {
    this.setState( {
      error: error
    } );
  }
  handleLogout() {
    console.log("Logging user out!!!");
    axios.post("/admin/logout");
    this.props.parentCallback(null);
  }
  componentDidMount() {
    // called after initial mount to DOM. Thus, only called once.
    // see React Component Lifecyle.
    axios.get("/test/info/").then(this.handleSuccess).catch(this.handleError);

    if (this.context) {
      // fetch userModel.
      let url = this.props.match.url;
      let uIndex = url.search(/\/photos\//i);
      let pIndex = url.search(/\/users\//i);
      const atHomePage = (uIndex === -1 && pIndex === -1);

      if (!atHomePage) {
        const currId = url.substring(url.lastIndexOf("/")+1);
        axios.get("/user/" + currId).then(this.handleSuccess).catch(this.handleError);
      }
    }
  }
  componentDidUpdate(prevProps) {
    const prevUrl = prevProps.match.url;
    const currUrl = this.props.match.url;

    if (prevUrl !== currUrl) {
      let uIndex = currUrl.search(/\/photos\//i);
      let pIndex = currUrl.search(/\/users\//i);
      const atHomePage = (uIndex === -1 && pIndex === -1);

      if (!atHomePage) {
        if (this.context) {
          const currId = currUrl.substring(currUrl.lastIndexOf("/")+1);
          axios.get("/user/" + currId).then(this.handleSuccess).catch(this.handleError);
        }
      } else {
        //only userModel will change since testSchema.__v is hardcoded.
        //single fetch from DidMount is enough. so no need to re-FETCH version number.
      }
    }
  }
  render() {
    // get location info from url.
    let url = this.props.match.url;
    let uIndex = url.search(/\/photos\//i);
    let pIndex = url.search(/\/users\//i);
    const atHomePage = (uIndex === -1 && pIndex === -1);

    // let context;
    if (atHomePage) {
      const isLoaded = this.state.versionIsLoaded;
      const error = this.state.error;
      if (error || !isLoaded) {
        // context = "Home Page";
      } else {
        // context = "Home Page " + this.state.version;
      }
    } else {
      const isLoaded = this.state.userIsLoaded;
      const error = this.state.error;
      if (error || !isLoaded) {
        //don't display anything for context.
      } else {
        // let userModel = this.state.userModel;
        // let name = userModel.first_name + " " + userModel.last_name;
        // context = (uIndex === -1) ? "Hi, " + name : name + "'s Photos"; //TODO: fix this.
      }
    }

    //for Add Photop Button
    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const handleClick = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };
    
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute" style={{background: "#55b0c9"}}>
        <Toolbar className="cs142-topbar-flexbox">
          <Typography variant="h5" color="inherit" className="cs142-topbar-flexitem name">
            San Diego Refugee Tutoring: Fast Math Worksheet
          </Typography>

          { //Add Photo Button.
            this.context ? 
            // this shoudl go in the materialUI PopOver.
            // perhaps place PopOver in a new component called userUploadPhoto
            // remember to link in photoShare.jsx
            //<input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
            <Button size="small" variant="contained" color="primary">
              <Link to={"/users/" + this.context._id}> Add Photos </Link>
            </Button>
            // <div>Add Photo </div>
            :
            ""
          }
          <div className="cs142-topbar-flexitem context">
          <Typography variant="h5" color="inherit">
            {
              this.context ? "Hi " + this.context.first_name + this.context.last_name : "Login Page"
            }
          </Typography>


          <Typography className="cs142-topbar-logout" onClick={this.handleLogout}>
            {
              this.context ? "logout" : ""
            }
          </Typography>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
