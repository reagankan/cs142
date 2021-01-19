import React from 'react';
import {Link} from 'react-router-dom';

import { withStyles } from "@material-ui/core/styles";
import {
  Button, Typography,
  // Popover,
  // Card, CardActions, CardContent
} from '@material-ui/core';
import '../userDetail/userDetail.css';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
// import FilledInput from '@material-ui/core/FilledInput';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
// import TextField from '@material-ui/core/TextField';
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

      first_name: "",
      last_name: "",
      description: "",
      location: "California, USA",
      occupation: "SDRT Math Student",

      error: null,

      context: context,

      openPopover: false,

      newUsername: "",
      registrationSuccess: false,
    }
    console.log("LOGINREGISTER::CONSTRUCTOR::mode", this.state.mode)
    // console.log("LoginRegister::constructor::parentCallback: ", this.props.parentCallback);


    this.saveUsername = this.saveUsername.bind(this);
    this.savePassword = this.savePassword.bind(this);
    this.savePassword2 = this.savePassword2.bind(this);

    this.handlePostSuccess = this.handlePostSuccess.bind(this);
    this.handlePostError = this.handlePostError.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  displayError() {
    return (
      <div>
      <Typography>For TestUsers:</Typography>
      <Typography>username: lowercase of last name</Typography>
      <Typography>password: weak</Typography>
      <br></br>
      <Typography>
      {this.state.error}
      </Typography>
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
    // console.log("LoginRegister::handlePostError::error: ", error, error.response, JSON.parse(JSON.stringify(error)));
    this.setState({
      error: error.response.data,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    if (this.state.mode === "login") {
      axios.post("/admin/login",
        {
          login_name: this.state.username,
          password: this.state.password,
        }
      ).then(this.handlePostSuccess).catch(this.handlePostError);
    } else if (this.state.mode === "register") {
      if (this.state.password !== this.state.password2) {
        this.setState({
          error: "RegistrationError: passwords are not equal."
        });
        return;
      }
      axios.post("/user",
        {
          login_name: this.state.username,
          password: this.state.password,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          location: this.state.location,
          description: this.state.description,
          occupation: this.state.occupation,
        }
      ).then(()=>{
        this.setState({
          mode: "login",
          username: "", 
          password: "",
          password2: "",
          first_name: "",
          last_name: "",
          error: null,
          registrationSuccess: true,
          newUsername: this.state.username,
        })
      }).catch((error)=>{this.handlePostError(error)});
    }
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
    const getInput = (metadata) => {
      return <FormControl>
      <InputLabel htmlFor="standard-adornment-username">{metadata.label}</InputLabel>
      <Input
        id="standard-adornment-username"
        type={metadata.stateVariable ? 'text' : 'username'}
        value={metadata.stateVariable}
        onChange={metadata.handler}
      />
      </FormControl>;
    };
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
    const password2Input = () => {
      return (
        <FormControl>
        <InputLabel htmlFor="standard-adornment-password">Password Again</InputLabel>
        <Input
          id="standard-adornment-password"
          type={this.state.showPassword ? 'text' : 'password'}
          value={this.state.password2}
          onChange={this.savePassword2}
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
    const GreenTextTypography = withStyles({
      root: {
        color: "green"
      }
    })(Typography);
    return (
      <div>
      <img src="../../images/sdrt-logo.png" width="100%"/>
      {
      (this.state.mode === "login") ?
      <Typography gutterBottom variant="h5" component="h2"> 
      Please Login
      </Typography>
      :
      <Typography gutterBottom variant="h5" component="h2">
      Create an account
      </Typography>
      }
      {
        (this.state.mode === "login" && this.state.registrationSuccess) && 
        <GreenTextTypography >
        New user ({this.state.newUsername}) successfully registered!
        </GreenTextTypography>
      }
      {
      (this.state.mode === "register") && 
      <div>{getInput({
        label:"First Name",
        stateVariable: this.state.first_name,
        handler: (event) => {
          this.setState({
            first_name: event.target.value
          })
        }
      })}</div>
      }{
      (this.state.mode === "register") && 
      <div>{getInput({
        label:"Last Name",
        stateVariable: this.state.last_name,
        handler: (event) => {
          this.setState({
            last_name: event.target.value
          })
        }
      })}</div>
      }
      <div>{usernameInput()}</div>
      <div>{passwordInput()}</div>
      {
        (this.state.mode === "register") &&
          <div>{password2Input()}</div>
      }  
      <Button onClick={this.handleSubmit}>Submit</Button>
      {
        this.state.error && this.displayError()
      }

      {
        (this.state.mode === "login") ?
          <p>
            Do not have an account? Create one
            <Link to="/login-register/register" onClick={()=>{this.setState({mode: "register", username: "", password: "", password2: "", first_name: "", last_name: "", error: null, registrationSuccess: false})}}> here. </Link>
          </p>
          :
          <p>
            Already have an account? Login
            <Link to="/login-register/login" onClick={()=>{this.setState({mode: "login", username: "", password: "", password2: "", first_name: "", last_name: "", error: null, registrationSuccess: false})}}> here. </Link>
          </p>
      }
      </div> 
      
    );
  }
  render() {
    return this.renderMaterialUI();
  }
}

export default LoginRegister;