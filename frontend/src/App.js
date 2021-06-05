import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation.js";

import Users from "./users/pages/Users.js";
import Auth from "./users/pages/Auth.js";
import UserPlaces from "./places/pages/UserPlaces.js";
import NewPlace from "./places/pages/NewPlace.js";
import UpdatePlace from "./places/pages/UpdatePlace.js";

import { useAuth } from "./shared/hooks/auth-hook.js";
import { AuthContext } from "./shared/components/Context/Auth-context.js";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner.js";

import "./App.css";

// const Auth = lazy(() => import("./users/pages/Auth.js"));
// const UserPlaces = lazy(() => import("./places/pages/UserPlaces.js"));
// const NewPlace = lazy(() => import("./places/pages/NewPlace.js"));
// const UpdatePlace = lazy(() => import("./places/pages/UpdatePlace.js"));

function App() {
  const [isLoggedIn, login, logout] = useAuth();

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" component={Users} exact />
        <Route path="/places/new" component={NewPlace} />
        <Route path="/:userId/places" component={UserPlaces} />
        <Route path="/places/:placeId" component={UpdatePlace} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" component={Users} exact />
        <Route path="/auth" component={Auth} />
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        <Router>
          <MainNavigation />
          {/* <main>
            <Suspense fallback={<LoadingSpinner />}>{routes}</Suspense>
          </main> */}
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
