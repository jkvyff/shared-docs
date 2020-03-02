import React from "react";
import { SyncedEditor } from "./SyncedEditor";
import { RouteComponentProps } from "react-router-dom";

export const GroupsEditor: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id }
  }
}) => {
  return (
    <>
      <SyncedEditor groupId={id} />
    </>
  );
};
