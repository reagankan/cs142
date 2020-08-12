import React from 'react';
import {
  Divider,
  List,
  ListItem,
  // ListItemText,
  // Typography,
}
from '@material-ui/core';
import './userList.css';

//add import for linking.
//THE BRACES MUST be there.
// react-router-dom was exported a certain way
// so all imports must follow a similar import way.
import {Link} from 'react-router-dom';

import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    // Problem #1: use window.cs142models hack for server.
    // let userListModel = window.cs142models.userListModel();
    // this.state = {
    //   userListModel: userListModel
    // }

    // Problem #2: use lib/fetchModel to interface XMLHttpResponse
    this.state = {
      error: null,
      isLoaded: false,
      userListModel: []
    }

    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  getList() {
    const { error, isLoaded, userListModel } = this.state;

    if (error || !isLoaded) {
      return;
    }

    // console.log(userListModel);

    var listContent = [];
    let itemId = 0;

    let divider = <Divider key={itemId-1}/>;
    for (let user of userListModel) {
      // wrap content(as text) in listItem.
      // use CSS to set 'hover' property of ListItem 
      let text = user.first_name + " " + user.last_name;
      let listItem =  <ListItem className="listItem"> {text} </ListItem>;

      //add links
      //use the Route path defined in photoShare.jsx.
      //replace "userId" with actual id.
      let path = "/users/" + user._id;
      listContent.push(<Link to={path} key={itemId}> {listItem} {divider} </Link>);
      itemId += 1;
    }
    return <List component="nav"> {listContent} </List>
  }
  handleSuccess(value) {
    this.setState( {
      isLoaded: true,
      userListModel: value.data //recall, fetchModel returns modelInfo in object.data property.
    } );
  }
  handleError(error) {
    this.setState( {
      isLoaded: true,
      error: error
    } );
  }
  componentDidMount() {
    let promise = fetchModel("/user/list");
    promise.then(this.handleSuccess, this.handleError);
  }
  render() {
    return (
      <div>
        
        {this.getList()}
        
      </div>
    );
  }
}

export default UserList;
