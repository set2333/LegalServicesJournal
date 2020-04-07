import React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './pages/App.jsx';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app'),
);
