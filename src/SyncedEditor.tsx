import React, { useMemo, useEffect, useRef, useCallback } from "react";
import { Editor, createEditor, Operation } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import io from "socket.io-client";
import { Leaf, Element, MarkButton, BlockButton } from "./Formatting";

const socket = io("http://localhost:4000");

interface Props {
  value: any;
  setValue: any;
  groupId: string;
  handleTime: any;
}

export const SyncedEditor: React.FC<Props> = ({
  value,
  setValue,
  groupId,
  handleTime
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const remote = useRef(false);
  const id = useRef(`${Date.now()}`);
  const socketchange = useRef(false);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  useEffect(() => {
    fetch(`http://localhost:4000/docs/${groupId}`)
      .then(res => res.json())
      .then(json => {
        setValue(JSON.parse(json[0].body));
        handleTime(json[0].timestamp.toString());
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
  }, [editor, groupId, handleTime, setValue]);

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
    [editor.operations, groupId, setValue]
  );

  return (
    <>
      <div className="editor">
        <div>
          <MarkButton format="bold" editor={editor} />
          <MarkButton format="code" editor={editor} />
          <MarkButton format="italic" editor={editor} />
          <MarkButton format="underline" editor={editor} />
          <BlockButton format="block-quote" editor={editor} />
          <BlockButton format="numbered-list" editor={editor} />
          <BlockButton format="bulleted-list" editor={editor} />
        </div>
        <hr />
        <Slate editor={editor} value={value} onChange={updateOperations}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Edit the text for all to see."
          />
        </Slate>
      </div>
    </>
  );
};
