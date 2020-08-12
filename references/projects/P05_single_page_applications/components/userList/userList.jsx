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
  }

  getList() {
    var listContent = [];
    let itemId = 0;

    let divider = <Divider key={itemId-1}/>;
    for (let user of window.cs142models.userListModel()) {
      let text = user.first_name + " " + user.last_name;

      //add links
      //use the Route path defined in photoShare.jsx.
      //replace "userId" with actual id.
      let listItem =  <ListItem className="listItem"> {text} </ListItem>;
      
      // listContent.push(<ListItem key={itemId} className="listItem"> {text} </ListItem>);
      // listContent.push(<Divider key={itemId+1}/>);

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
        
        {
        //   <Typography variant="body1">
        //   This is the user list, which takes up 3/12 of the window.
        //   You might choose to use <a href="https://material-ui.com/demos/lists/">Lists</a> and <a href="https://material-ui.com/demos/dividers">Dividers</a> to
        //   display your users like so:
        // </Typography>
        //   <List component="nav">
        //   <ListItem>
        //     <ListItemText primary="Item #1" />
        //   </ListItem>
        //   <Divider />
        //   <ListItem>
        //     <ListItemText primary="Item #2" />
        //   </ListItem>
        //   <Divider />
        //   <ListItem>
        //     <ListItemText primary="Item #3" />
        //   </ListItem>
        //   <Divider />
        // </List>
        // <Typography variant="body1">
        //   The model comes in from window.cs142models.userListModel()
        // </Typography>
        }
        
      </div>
    );
  }
}

export default UserList;
