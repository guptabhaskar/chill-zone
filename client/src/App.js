import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { lazy } from "react";

import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
const Home = lazy(() => import("./components/Home/Home"));
const Room = lazy(() => import("./components/Room/Room"));
const ChatPage = lazy(() => import("./components/ChatPage/ChatPage"));
const Lunch = lazy(() => import("./components/Lunch/Lunch"));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
          <React.Suspense fallback={null}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/join/:id" component={Room} />
              <Route path="/chat/:id" component={ChatPage} />
              <Route path="/lunch" component={Lunch} />
            </Switch>
          </React.Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
