import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());

    this.state = {
      input: "",
      substring: "al"
    };

    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getStates() {
    let regex = new RegExp(this.state.substring, "i");

    let listItems = [];
    let allStates = window.cs142models.statesModel()
    for (let i = 0; i < allStates.length; i++) {
      let state = allStates[i];
      if (state.search(regex) !== -1) {
        let elemClass = (window.cs142models.democraticStates.has(state)) ? "cs142-states-blue" : "cs142-states-red";

        listItems.push(<li key={i} className={elemClass}> {state} </li>);
      }
    }
    let states = <div>
      <p>  States containing substring(<b> {this.state.substring} </b>):  </p>
      <ul> 
        {listItems}
      </ul>
    </div>;
    return (listItems.length !== 0) ? states : <p> No states were found with substring === <b> {this.state.substring} </b> </p>;
  }
  updateInput(event) {
    this.setState({ input: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ substring: this.state.input });
  }
  render() {
    return (
      <div>
        {this.getStates()}

        <form onSubmit={this.handleSubmit}>
          <label>
            Enter substring
            <input type="text" onChange={this.updateInput}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

export default States;
