import React from "react";
import PropTypes from "prop-types";

function Icon({ className, fill }: { className: string; fill: string }) {
  let icon = "";
  switch (className) {
    case "bold":
      icon =
        "M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z";
      break;
    case "code":
      icon =
        "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z";
      break;
    case "italic":
      icon = "M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z";
      break;
    case "underline":
      icon =
        "M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z";
      break;
    case "block-quote":
      icon = "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z";
      break;
    case "numbered-list":
      icon =
        "M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z";
      break;
    case "bulleted-list":
      icon =
        "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z";
      break;
  }
  return (
    <svg viewBox="0 -6 24 24" height="20" width="20" className={className}>
      <path fill={fill} d={icon} />
    </svg>
  );
}

Icon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string
};

Icon.defaultProps = {
  className: undefined,
  fill: "#fff"
};

export default Icon;
