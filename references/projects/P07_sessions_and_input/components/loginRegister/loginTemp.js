import React from 'react';

import {
  Button, Typography
} from '@material-ui/core';
import '../userDetail/userDetail.css';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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

      username: "",
      password: "",
      password2: "",
      showPassword: false,

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
      <div>
      <Typography>username: lowercase of last name</Typography>
      <Typography>password: weak</Typography>
      <Typography>API error: {this.state.error}</Typography>
      </div>
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
    axios.post("/admin/login",
      {
        login_name: this.state.username,
        password: this.state.password,
      }
    ).then(this.handlePostSuccess).catch(this.handlePostError);
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
  renderBasicJS() {
    // console.log("LoginRegister::render::context: ", this.context);
    return (
      <div>
        <img src="../../images/sdrt-logo.png" width="100%"/>
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
  renderMaterialUI() {
    const usernameInput = () => {
      return <FormControl>
      <InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
      <Input
        id="standard-adornment-username"
        type={this.state.username ? 'text' : 'username'}
        value={this.state.username}
        onChange={this.saveUsername}
      />
      </FormControl>;
    };
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    const passwordInput = () => {
      return (
        <FormControl>
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={this.state.showPassword ? 'text' : 'password'}
          value={this.state.password}
          onChange={this.savePassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={
                  () => {
                    this.setState({
                      showPassword: !this.state.showPassword,
                    });
                  }
                }
                onMouseDown={handleMouseDownPassword}
              >
                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        </FormControl>
      );
    };
    return (
      <div>
      <div>{usernameInput()}</div>
      <div>{passwordInput()}</div>

      <div>{passwordInput()}</div>

      <Button onClick={this.handleSubmit}>Submit</Button>
      {
          this.state.error && this.displayError()
      }
      </div>
    );
  }
  render() {
    return this.renderBasicJS();
  }
}

export default LoginRegister;
