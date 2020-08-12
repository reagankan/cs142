import React from 'react';
import {Link} from 'react-router-dom';

import {
  Typography
} from '@material-ui/core';
import './userDetail.css';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    let userModel = window.cs142models.userModel(this.props.match.params.userId);
    let photoModel = window.cs142models.photoOfUserModel(this.props.match.params.userId);
    this.state = {
      id: this.props.match.params.userId,
      userModel: userModel,
      first_name: userModel.first_name,
      last_name: userModel.last_name,
      description: userModel.description,
      location: userModel.location,
      occupation: userModel.occupation,
      photoModel: photoModel
    }
  }
  getPhotoPath(idx) {
    let imagePaths = [];
    for (let image of this.state.photoModel) {
      imagePaths.push("images/"+image.file_name);
    }
    // console.log(imagePaths);
    return (idx < imagePaths.length) ? imagePaths[idx] : imagePaths[0];
  }

  componentDidUpdate(prevProps) {
    let prevId = prevProps.match.params.userId;
    let currId = this.props.match.params.userId;
    if (prevId !== currId) {
      let userModel = window.cs142models.userModel(currId);
      let photoModel = window.cs142models.photoOfUserModel(currId);
      this.setState({
      id: this.props.match.params.userId,
      userModel: userModel,
      first_name: userModel.first_name,
      last_name: userModel.last_name,
      description: userModel.description,
      location: userModel.location,
      occupation: userModel.occupation,
      photoModel: photoModel
    });
    }
  }
  render() {
    return (
      <div>
      {
        <Card className="userDetail-cardRoot">
            <div className="userDetail-coverImageBox">
              <img className="userDetail-coverImage" src={this.getPhotoPath()}></img>
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.state.first_name + " " + this.state.last_name}
              </Typography>
              <Typography color="textSecondary" component="p">
                <b>Location:</b> {this.state.location} <br/>
                <b>Occupation:</b> {this.state.occupation} <br/>
                <b>Description:</b> {this.state.description} <br/>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                <Link to={"/photos/" + this.state.id}> View Photos </Link>
              </Button>
            </CardActions>
        </Card>
      }
      </div>
    );
  }
}

export default UserDetail;
