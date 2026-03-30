import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Base from "./pages/base";
import Login from "./pages/login";
import Landing from "./pages/login";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./pages/unauthorized";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* public routes */}
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/unauthorized" component={Unauthorized} />

          {/* protected admin layout */}
          <ProtectedRoute path="/admin" component={Base} />

          {/* fallback */}
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;