import SwitchView from './components/switchView/SwitchView';

// errors out if these come before Header, Example, States imports.
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <SwitchView />,
  document.getElementById('reactapp'),
);
