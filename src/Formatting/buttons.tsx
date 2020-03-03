import React from "react";
import { Editor } from "slate";
import { useSlate } from "slate-react";

// export const Button = React.forwardRef(
//   ({ className, active, reversed, ...props }, ref) => (
//     <span
//       {...props}
//       ref={ref}
//       className={cx(
//         className,
//         css`
//           cursor: pointer;
//           color: ${reversed
//             ? active
//               ? 'white'
//               : '#aaa'
//             : active
//             ? 'black'
//             : '#ccc'};
//         `
//       )}
//     />
//   )
// )

// export const BlockButton = ({ format, icon }) => {
//   const editor = useSlate();
//   return (
//     <button
//       active={isBlockActive(editor, format)}
//       onMouseDown={event => {
//         event.preventDefault();
//         toggleBlock(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </button>
//   );
// };

// export const MarkButton = ({ format, icon }: any) => {
//   const editor = useSlate();
//   return (
//     <button
//       active={isMarkActive(editor, format)}
//       onMouseDown={event => {
//         event.preventDefault();
//         toggleMark(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </button>
//   );
// };

const isMarkActive = (editor: any, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// const isBlockActive = (editor: any, format: string) => {
//   const [match] = Editor.nodes(editor, {
//     match: n => n.type === format
//   });

//   return !!match;
// };

const toggleMark = (editor: any, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
