import React, { useRef, useState, useEffect } from "react";

interface Props {}

export const Sidebar: React.FC<Props> = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return width > 1400 ? (
    <div className="sidebar">
      <h2>Shared Docs</h2>
      <p>Edit to see updates in realtime. Save when you want to share.</p>
      <p>Create a new page by typing whatever you want after 'docs/'</p>
    </div>
  ) : (
    <div className="sidebar">
      <h3 className="title">Shared Docs</h3>
    </div>
  );
};
