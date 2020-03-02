import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { GroupsEditor } from "./GroupsEditor";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Route
          path="/"
          exact
          render={() => {
            return <Redirect to={`/docs/${Date.now()}`} />;
          }}
        />
        <Route path="/docs/:id" exact component={GroupsEditor} />
      </BrowserRouter>
    </div>
  );
};

export default App;
