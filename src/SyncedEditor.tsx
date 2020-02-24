import React, { useMemo, useState, useEffect, useRef } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { initialValue } from "./slateInitialValue";
import Mitt from "mitt";

const emitter: mitt.Emitter = Mitt();

export const SyncedEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(initialValue);
  // const remote = useRef(null);

  useEffect(() => {
    emitter.on("*", () => {
      console.log("changed");
    });
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={options => setValue(options)}
    >
      <Editable
        onKeyDown={event => {
          console.log(editor.operations);

          const ops = editor.operations
            .filter(o => {
              if (o) {
                return (
                  o.type !== "set_selection" &&
                  (!o.data || !o.data.has("source"))
                );
              }
              return o;
            })
            .map((o: any) => ({ ...o, data: { source: "one" } }));
          emitter.emit("something", ops);
        }}
      />
    </Slate>
  );
};
