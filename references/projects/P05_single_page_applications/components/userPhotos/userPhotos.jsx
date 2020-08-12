import React from 'react';
import {Link} from 'react-router-dom';
import {
  Typography,
  Divider
} from '@material-ui/core';
import './userPhotos.css';


// import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
// import IconButton from '@material-ui/core/IconButton';
// import InfoIcon from '@material-ui/icons/Info';

import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardMedia from '@material-ui/core/CardMedia';

// import Button from '@material-ui/core/Button';


/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
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
  updateContext() {
    window.cs142models.context = "Photos of " + this.first_name + " " + this.last_name;
  }
  getUserPhotos() {
    let imageElements = [];
    let keyId = 0;
    for (let image of window.cs142models.photoOfUserModel(this.id)) {
      console.log(image);
      imageElements.push(<img src={"images/"+image.file_name} key={keyId} />)
      keyId += 1;
    }
    // console.log(imgSrc);
    return imageElements;
  }
  getGridListTiles() {
    let gridTiles = []
    for (let image of window.cs142models.photoOfUserModel(this.id)) {
      console.log(image.comments);
      let imageElem = <img src={"images/"+image.file_name} alt={image.file_name} />;
      let tileBarElem = <GridListTileBar title={`${image.file_name} (${image.date_time})`} />;
      let tileElem = <GridListTile key={image.file_name}>
        {imageElem}
        {tileBarElem}
      </GridListTile>;
      gridTiles.push(tileElem);
    }
    return gridTiles;
  }
  getOneComment(commentObject, insertDiv=true) {
    let linkPath = "/users/" + commentObject.user._id;
    return (
      <div key={commentObject._id}>
      <Typography color="textSecondary" component="p">
        <Link to={linkPath} className="userPhotos-link"><b>{commentObject.user.first_name + " " + commentObject.user.last_name}</b></Link> ({commentObject.date_time}) <br/>
        {commentObject.comment} <br/>
      </Typography>
      {(insertDiv) && (<Divider/>)}
      </div>
    );
  }
  getComments(commentObjects, commentTitle) {
    let comments = [
    <Typography gutterBottom variant="h5" component="h2" key="comments"> Comments for {commentTitle} </Typography>,
    <Divider key="divider"/>
    ];
    if (commentObjects === undefined) {
      return comments;
    }
    let n = commentObjects.length;
    for (let i = 0; i < n; i++) {
      let com = this.getOneComment(commentObjects[i], i < n-1);
      comments.push(com);
    }
    return comments;
  }
  getCommentCards() {
    let cards = []
    for (let image of window.cs142models.photoOfUserModel(this.id)) {
      let imageElem = <div className="userDetail-coverImageBox">
              <img className="userDetail-coverImage" src={"images/"+image.file_name}></img>
            </div>;

      let card = <Card key={image.file_name} style={{ left: 0 }}>
        <CardContent>
          {imageElem}
          {this.getComments(image.comments, image.file_name + " (" + image.date_time + ")")}
        </CardContent>
      </Card>
      cards.push(card)
    }
    return cards;
  }
  render() {
    this.updateId(); //this is important. without, page won't update.
    this.queryDatabase();
    this.updateContext();

    let onlyOnePhoto = window.cs142models.photoOfUserModel(this.id).length === 1;
    return (
      <div className="userPhotos-root">
        <h1 className="userPhotos-pageTitle">{this.first_name+" "+this.last_name}&apos;s Photo Gallery</h1>
        {
        //aesthetic grid list w.o. comments.
        (!onlyOnePhoto) && (<GridList cellHeight={180} className="userPhotos-gridList">
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div" style={{color: 'white'}}>
              A Quick Photo Overview
            </ListSubheader>
          </GridListTile>
          { this.getGridListTiles() }
        </GridList>)
        }
        <ul>
        {
          //cards with comments
          this.getCommentCards()
        }
        </ul>
      </div>
  );
  }
}

export default UserPhotos;
