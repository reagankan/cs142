import React from 'react';

import {
  Typography
} from '@material-ui/core';
import '../userDetail/userDetail.css';

import axios from 'axios';

import {LoginContext} from '../loginContext/LoginContext';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class LoginRegister extends React.Component {
  static contextType = LoginContext;
  constructor(props, context) {
    super(props);
    // this.context = context;
    // console.log("LoginRegister::constructor: context", this.context);

    // Project 5, Problem #2: use lib/fetchModel to interface XMLHttpResponse
    // Project 6, Problem #2: use axios ... 
    this.state = {
      mode: this.props.match.params.mode, //login or register

      username: null,
      password: null,
      password2: null,

      error: null,

      context: context
    }

    // console.log("LoginRegister::constructor::parentCallback: ", this.props.parentCallback);


    this.saveUsername = this.saveUsername.bind(this);
    this.savePassword = this.savePassword.bind(this);

    this.handlePostSuccess = this.handlePostSuccess.bind(this);
    this.handlePostError = this.handlePostError.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  displayError() {
    return (
      <Typography>
      ENTER ERROR MSG HERE.
      </Typography>
    );
  }
  saveUsername(event) {
    this.setState({ username: event.target.value })
  }
  savePassword(event) {
    this.setState({ password: event.target.value })
  }
  savePassword2(event) {
    this.setState({ password2: event.target.value })
  }

  handlePostSuccess(value) {
    //TODO: set global context to value.data.
    // console.log("LoginRegister::handlePostSuccess::value.data: ", value.data);
    // this.context = value.data;
    let user = value.data;
    // let id = user._id;
    // console.log("LoginRegister::handlePostSuccess::user: ", user);
    this.props.parentCallback(user);
    // <Redirect path="/login-register/login" to={"/users/" + id} />
  }
  handlePostError(error) {
    console.log("LoginRegister::handlePostError::error: ", error);
    this.setState({
      error: error,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    axios.post("/admin/login", {login_name: this.state.username}).then(this.handlePostSuccess).catch(this.handlePostError);
  }
  componentDidMount() {

  }
  componentDidUpdate(prevProps) {
    let prevMode = prevProps.match.params.mode;
    let currMode = this.props.match.params.mode;
    if (prevMode !== currMode) {
      this.setState({
        mode: currMode
      })
    }
    // console.log("LoginRegister::DidUpdate::new context: ", context, React.version);
    // console.log("LoginRegister::DidUpdate::old context: ", this.state.context);
  }
  render() {
    // console.log("LoginRegister::render::context: ", this.context);
    return (
      <div>
        <img src=""/>
        <Typography gutterBottom variant="h5" component="h2">
          Login Page
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <label>
          <b>username:</b> <input type="text" onChange={this.saveUsername}/> <br/>
          </label>

          <label>
          <b>password:</b> <input type="text" onChange={this.savePassword}/> <br/>
          </label>

          {
          (this.mode === "register") &&
            (<label>
            <b>password again:</b> <input type="text" onChange={this.savePassword2}/> <br/>
            </label>)
          }

          <input type="submit" value="submit button"/>
        </form>
        {
          this.state.error && this.displayError()
        }
      </div>
    );
  }
}

export default LoginRegister;
