import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import Base from './pages/base';
import Dashboard from './pages/dashboard';
import PersonDashboard from './pages/components/person'
import Login from './pages/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import GPSMap from './pages/map-v2';

function App() {

  const isAuthenticated = false;

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" render={() => <Login />} />
          {/* <Route path="/admin" render={() => isAuthenticated ? <Base /> : <Redirect to="/login" />} /> */}
          <Route path="/admin" render={ () => <Base />} />
          <Route path="/user" render={() => isAuthenticated ? <GPSMap /> : <Redirect to="/login" />} />
          {/* <Route path="/user" render={() => <GPSMap />} /> */}
          {/* <Route path="/user" render={() => isAuthenticated ? <GPSDisplay /> : <Redirect to="/login" />} /> */}
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </div>
  );

}


export default App;
