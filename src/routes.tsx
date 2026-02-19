import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from "./pages/dashboard";
import PersonDashboard from "./pages/components/person";
import Login from "./pages/login";
import GeoFencing from "./pages/geofencing/main";
import TrackSelect from "./pages/track_person/track_select";
import DeployedUnits from "./pages/deployed/main";

const routers = () => {

    return (
        <Router>
            <Switch>
                <Route path="/admin/dashboard" render={() => <Dashboard />} />
                <Route path='/admin/person' render={() => <PersonDashboard />} />
                <Route path='/admin/geofence' render={() => <GeoFencing />} />
                <Route path='/admin/track_person' render={() => <TrackSelect />} />
                <Route path='/admin/deploy' render={() => <DeployedUnits />} />
                <Route path='/login' render={() => <Login />} />
            </Switch>
        </Router>
        // <BrowserRouter>
        //     <Routes>
        //         <Route path="/" element={<Dashboard />} />
        //         <Route path='/find_patroller' element={<FindUser />} />
        //         <Route path='/person' element={<PersonDashboard />} />

        //         {/* <Route path="/" element={<Layout />}>
        //         <Route index element={<Home />} />
        //         <Route path="blogs" element={<Blogs />} />
        //         <Route path="contact" element={<Contact />} />
        //         <Route path="*" element={<NoPage />} />
        //     </Route> */}
        //     </Routes>
        // </BrowserRouter>

    )

}

export default routers;