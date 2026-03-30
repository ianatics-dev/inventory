import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./auth";

type ProtectedRouteProps = RouteProps & {
  component: React.ComponentType<any>;
  allowedRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const authenticated = isAuthenticated();
        const role = getUserRole();

        if (!authenticated) {
          return <Redirect to="/login" />;
        }

        if (allowedRoles && (!role || !allowedRoles.includes(role))) {
          return <Redirect to="/unauthorized" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;