import React from "react";
import { SyncedEditor } from "./SyncedEditor";
import { RouteComponentProps } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const GroupsEditor: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id }
  }
}) => {
  return (
    <>
      <Sidebar />
      <SyncedEditor groupId={id} />
    </>
  );
};
