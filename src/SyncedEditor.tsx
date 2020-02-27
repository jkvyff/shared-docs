import React, { useMemo, useState, useEffect, useRef } from "react";
import { Editor, createEditor, Operation } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { initialValue } from "./slateInitialValue";
import Mitt from "mitt";

const emitter: mitt.Emitter = Mitt();

export const SyncedEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(initialValue);
  const remote = useRef(false);
  const id = useRef(`${Date.now()}`);
  const emmiterchange = useRef(false);

  useEffect(() => {
    (emitter as any).on("*", (type: string, ops: any) => {
      if (id.current !== type) {
        remote.current = true;
        Editor.withoutNormalizing(editor, () => {
          JSON.parse(ops).forEach((op: Operation) => {
            editor.apply(op);
          });
        });
        remote.current = false;
        emmiterchange.current = true;
        console.log("changed elsewhere");
      }
    });
  }, [editor]);

  return (
    <>
      <div className="editor">
        <Slate
          editor={editor}
          value={value}
          onChange={options => {
            setValue(options);
            const ops = editor.operations
              .filter(o => {
                if (o) {
                  return o.type !== "set_selection";
                }
                return false;
              })
              .map((o: any) => ({ ...o, data: { source: id.current } }));
            if (
              ops &&
              ops.length &&
              !remote.current &&
              !emmiterchange.current
            ) {
              emitter.emit(id.current, JSON.stringify(ops));
            }
            emmiterchange.current = false;
          }}
        >
          <Editable />
        </Slate>
      </div>
    </>
  );
};
