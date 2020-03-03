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
import { Leaf, Element } from "./Formatting";

const socket = io("http://localhost:4000");

interface Props {
  groupId: string;
}

export const SyncedEditor: React.FC<Props> = ({ groupId }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(initialValue);
  const remote = useRef(false);
  const id = useRef(`${Date.now()}`);
  const [updatedTime, setUpdatedTime] = useState("");
  const dayOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short"
  };
  const socketchange = useRef(false);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  useEffect(() => {
    fetch(`http://localhost:4000/docs/${groupId}`)
      .then(res => res.json())
      .then(json => {
        setValue(JSON.parse(json[0].body));
        setUpdatedTime(json[0].timestamp.toString());
      })
      .catch(err => {
        console.error("Error:", err);
      });

    const eventName = `new-remote-operations-${groupId}`;
    socket.on(
      eventName,
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

    return () => {
      socket.off(eventName);
    };
  }, [editor, groupId]);

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
        socket.emit("new-operations", { editorId: id.current, ops, groupId });
      }
      socketchange.current = false;
    },
    [editor.operations, groupId]
  );

  const saveDoc = useCallback(() => {
    fetch(`http://localhost:4000/docs/${groupId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body: value })
    })
      .then(res => res.json())
      .then(json => setUpdatedTime(json.timestamp));
  }, [value, groupId]);

  const isMarkActive = (editor: any, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = useCallback(
    ev => {
      ev.preventDefault();
      const isActive = isMarkActive(editor, "bold");

      if (isActive) {
        Editor.removeMark(editor, "bold");
      } else {
        Editor.addMark(editor, "bold", true);
      }
    },
    [editor]
  );

  return (
    <>
      <div className="editor">
        <div>
          {new Date(updatedTime).toLocaleDateString("en-US", dayOptions)}
        </div>
        <div>
          {new Date(updatedTime).toLocaleTimeString("en-US", timeOptions)}
        </div>
        <button className="btn btn-first" onClick={saveDoc}>
          Save
        </button>
        <button className="btn" onMouseDown={toggleMark}>
          Bold
        </button>
        <hr />
        <Slate editor={editor} value={value} onChange={updateOperations}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Edit the text for all to see what you made."
          />
        </Slate>
      </div>
    </>
  );
};
