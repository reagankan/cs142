import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
  }
  getContext() {
    let url = this.props.match.url;
    let uIndex = url.search(/\/photos\//i);
    let pIndex = url.search(/\/users\//i);


    if (uIndex === -1 && pIndex === -1) {
      return "Home Page";
    }
    let id = url.substring(url.lastIndexOf("/")+1);
    let userModel = window.cs142models.userModel(id);
    let first_name = userModel.first_name;
    let last_name = userModel.last_name;
    let name = first_name + " " + last_name;
    return (uIndex === -1) ? name : name + "'s Photos";
  }
  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="cs142-topbar-flexbox">
          <Typography variant="h5" color="inherit" className="cs142-topbar-flexitem name">
            Reagan Kan&apos;s FB
          </Typography>

          <Typography variant="h5" color="inherit" className="cs142-topbar-flexitem context">
            {this.getContext()}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
