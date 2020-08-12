import React from 'react';
import {Link} from 'react-router-dom';

import {
  Typography
} from '@material-ui/core';
import './userDetail.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardMedia from '@material-ui/core/CardMedia';

import Button from '@material-ui/core/Button';


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
 /**

Here is how UserDetail is created in photoShare.render();
  <Route path="/users/:userId"
    render={ props => <UserDetail {...props} /> }
  />

  from the React Router DOM docs
  docs: https://reactrouter.com/web/api/Route/render-func
  Instead of having a new React element created for you using the component prop, 
  you can pass in a function to be called when the location matches.
  The render prop function has access to all the same route props (match, location and history)
  as the component render prop.

  so this.props.match should contain the userId.
  usage: (as in the cs142 SPA slide 10): {match.params.userId}

  Now we can do: userModel(userId);

 **/
class UserDetail extends React.Component {
  static classes = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    media: {
      // objectFit: "cover",

      width: "300px",
      // height: "100px",
      // height: "337",
      height: 0,
      // marginTop: '56.25%', // 16:9,
      // marginTop:'30'
    },
  });
  constructor(props) {
    super(props);
  }
  updateId() {
    this.id = this.props.match.params.userId;
  }
  queryDatabase() {
    this.userModel = window.cs142models.userModel(this.id);
    this.first_name = this.userModel.first_name;
    this.last_name = this.userModel.last_name;
    this.description = this.userModel.description;
    this.location = this.userModel.location;
    this.occupation = this.userModel.occupation;
  }
  getPhotos() {
    return window.cs142models.photoOfUserModel(this.id);
  }
  getPhotoPath(idx) {
    let imagePaths = [];
    for (let image of this.getPhotos()) {
      imagePaths.push("images/"+image.file_name);
    }
    // console.log(imagePaths);
    return (idx < imagePaths.length) ? imagePaths[idx] : imagePaths[0];
  }
  render() {
    this.updateId(); //this is important. without, page won't know to use new id.
    this.queryDatabase();
    // console.log(this.userModel);
    // console.log(this.getPhotoPath());
    return (
      <div>
      {
        <Card className={UserDetail.classes.root}>
            <div className="userDetail-coverImageBox">
              <img className="userDetail-coverImage" src={this.getPhotoPath()}></img>
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.first_name + " " + this.last_name}
              </Typography>
              <Typography color="textSecondary" component="p">
                <b>Location:</b> {this.location} <br/>
                <b>Occupation:</b> {this.occupation} <br/>
                <b>Description:</b> {this.description} <br/>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                <Link to={"/photos/" + this.id}> View Photos </Link>
              </Button>
            </CardActions>
        </Card>
      }
      </div>
    );
  }
}

export default UserDetail;
