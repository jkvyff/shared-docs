import React, { useState } from "react";
import { SyncedEditor } from "./SyncedEditor";
import { RouteComponentProps } from "react-router-dom";
import { initialValue } from "./slateInitialValue";
import { Sidebar } from "./Sidebar";

export const GroupsEditor: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id }
  }
}) => {
  const [updatedTime, setUpdatedTime] = useState(`${new Date()}`);
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <Sidebar
        value={value}
        updatedTime={updatedTime}
        handleTime={setUpdatedTime}
        groupId={id}
      />
      <SyncedEditor
        value={value}
        setValue={setValue}
        groupId={id}
        handleTime={setUpdatedTime}
      />
    </>
  );
};
