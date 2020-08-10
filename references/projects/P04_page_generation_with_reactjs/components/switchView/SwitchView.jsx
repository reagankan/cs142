import Header from './../header/Header';
import Example from './../example/Example';
import States from './../states/States';
import React from 'react';

/**
 * Define SwitchViews for Problem #4.
 */
class SwitchView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currView: window.cs142models.view1
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
  }
  handleButtonPress(event) {
    event.preventDefault();
    this.setState({ currView:  this.getNextView()});
  }
  getNextView() {
    return window.cs142models.nextView(this.state.currView);
  }
  getView() {
    if (this.state.currView === window.cs142models.view1) {
      return <Example />;
    }
    return <States />;
  }
  render() {
    return (
      <div>
        <Header />
        <form onSubmit={this.handleButtonPress}>
          <input type="submit" value={"Switch to " + this.getNextView()}/>
        </form>
        {this.getView()}
      </div>
    );
  }
}

export default SwitchView;
