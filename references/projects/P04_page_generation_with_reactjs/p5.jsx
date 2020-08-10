import Header from './components/header/Header';
import Example from './components/example/Example';
import States from './components/states/States';

import "./p5.css";

// errors out if these come before Header, Example, States imports.
import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route, Link } from "react-router-dom";


var cs142models;

if (cs142models === undefined) {
   cs142models = {
    view1: "Example",
    view2: "States"
   };
}
cs142models.nextView = function(view) {
    if (view === this.view1) {
        return this.view2;
    }
    return this.view1;
}

class SwitchView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currView: cs142models.view1
        };

        this.handleButtonPress = this.handleButtonPress.bind(this);
    }
    handleButtonPress(event) {
        event.preventDefault();
        this.setState({ currView:  this.getNextView()});
    }
    getNextView() {
        return cs142models.nextView(this.state.currView);
    }
    getView() {
        if (this.state.currView === cs142models.view1) {
            return <Example />;
        }
        return <States />;
    }
    render() {
        return (
            <div>
                <Header />
                <HashRouter>
                    <div className="toolbar container">
                        <Link to="/example" className="toolbar item"> Example </Link>
                        <Link to="/states" className="toolbar item"> States </Link>
                    </div>

                    <Route path="/example" component={Example}/> 
                    <Route path="/states" component={States}/> 
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(
  <SwitchView />,
  document.getElementById('reactapp'),
);