import React from "react";
import { Switch } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import PersonDashboard from "./pages/components/short_arm/person";
import IssuedDashboard from "./pages/components/long_arm/issued";
import OnStock from "./pages/components/short_arm/on_stock";
import UsersTable from "./pages/components/UserTable";
import ProtectedRoute from "./ProtectedRoute";
import ActivityLogTable from "./pages/components/activity_logs";
import LongArmOnStock from "./pages/components/long_arm/on_stock";

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

      {/* long arm ni sya */}
      <ProtectedRoute
        exact
        path="/admin/firearms/long-arm"
        component={LongArmOnStock}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />

      <ProtectedRoute
        exact
        path="/admin/firearms/short-arm"
        component={OnStock}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />

      {/* long arm ni sya sa issued */}
      <ProtectedRoute
        exact
        path="/admin/issued/long-arm"
        component={IssuedDashboard}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />

      <ProtectedRoute
        exact
        path="/admin/issued/short-arm"
        component={PersonDashboard}
        allowedRoles={["admin", "super_admin", "viewer"]}
      />
      
    </Switch>
  );
};

export default routers;