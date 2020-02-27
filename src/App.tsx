import React from "react";
import { SyncedEditor } from "./SyncedEditor";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <SyncedEditor />
      <SyncedEditor />
    </div>
  );
};

export default App;
