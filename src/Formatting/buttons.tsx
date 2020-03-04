import React from "react";
import { Editor, Transforms } from "slate";
import Icon from "./Icon";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const isMarkActive = (format: string, editor: any) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor: any, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });
  return !!match;
};

const toggleMark = (mark: string, editor: any) => {
  const isActive = isMarkActive(mark, editor);

  if (isActive) {
    Editor.removeMark(editor, mark);
  } else {
    Editor.addMark(editor, mark, true);
  }
};

const toggleBlock = (format: string, editor: any) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const MarkButton = ({
  format,
  editor
}: {
  format: string;
  editor: any;
}) => {
  return (
    <>
      <span
        className={isMarkActive(format, editor) ? "btn active" : "btn"}
        onMouseDown={event => {
          event.preventDefault();
          toggleMark(format, editor);
        }}
      >
        <Icon className={format} />
      </span>
    </>
  );
};

export const BlockButton = ({
  format,
  editor
}: {
  format: string;
  editor: any;
}) => {
  return (
    <>
      <span
        className={isBlockActive(format, editor) ? "btn active" : "btn"}
        onMouseDown={event => {
          event.preventDefault();
          toggleBlock(format, editor);
        }}
      >
        <Icon className={format} />
      </span>
    </>
  );
};
