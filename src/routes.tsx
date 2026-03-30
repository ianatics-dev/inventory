import React from "react";
import { Switch } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import PersonDashboard from "./pages/components/person";
import OnStock from "./pages/components/on_stock";
import UsersTable from "./pages/components/UserTable";
import ProtectedRoute from "./ProtectedRoute";
import ActivityLogTable from "./pages/components/activity_logs";

const routers = () => {
  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/admin/dashboard"
        component={Dashboard}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />

      <ProtectedRoute
        exact
        path="/admin/users"
        component={UsersTable}
        allowedRoles={["super_admin"]}
      />

      <ProtectedRoute
        exact
        path="/admin/activity_log"
        component={ActivityLogTable}
        allowedRoles={["super_admin"]}
      />

      <ProtectedRoute
        exact
        path="/admin/firearms"
        component={OnStock}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />

      <ProtectedRoute
        exact
        path="/admin/issued"
        component={PersonDashboard}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />
      
    </Switch>
  );
};

export default routers;