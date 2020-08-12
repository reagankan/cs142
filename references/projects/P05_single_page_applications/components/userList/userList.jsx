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

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    let userListModel = window.cs142models.userListModel();
    this.state = {
      userListModel: userListModel
    }
  }

  getList() {
    var listContent = [];
    let itemId = 0;

    let divider = <Divider key={itemId-1}/>;
    for (let user of this.state.userListModel) {
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

  render() {
    return (
      <div>
        
        {this.getList()}
        
      </div>
    );
  }
}

export default UserList;
