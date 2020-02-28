import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import { Editor, createEditor, Operation } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { initialValue } from "./slateInitialValue";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const SyncedEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(initialValue);
  const remote = useRef(false);
  const id = useRef(`${Date.now()}`);
  const socketchange = useRef(false);

  const updateOperations = useCallback(
    (options: any) => {
      setValue(options);
      const ops = editor.operations
        .filter(o => {
          if (o) {
            return o.type !== "set_selection";
          }
          return false;
        })
        .map((o: any) => ({ ...o, data: { source: id.current } }));
      if (ops && ops.length && !remote.current && !socketchange.current) {
        socket.emit("new-operations", { editorId: id.current, ops });
      }
      socketchange.current = false;
    },
    [editor.operations]
  );

  useEffect(() => {
    socket.on(
      "new-remote-operations",
      ({ editorId, ops }: { editorId: string; ops: Operation[] }) => {
        if (id.current !== editorId) {
          remote.current = true;
          Editor.withoutNormalizing(editor, () => {
            ops.forEach((op: Operation) => {
              editor.apply(op);
            });
          });
          remote.current = false;
          socketchange.current = true;
          console.log("changed elsewhere");
        }
      }
    );
  }, [editor]);

  return (
    <>
      <div className="editor">
        <Slate editor={editor} value={value} onChange={updateOperations}>
          <Editable />
        </Slate>
      </div>
    </>
  );
};
