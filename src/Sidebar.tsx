import React, { useState, useEffect, useCallback } from "react";

interface Props {
  groupId: string;
  value: any;
  updatedTime: string;
  handleTime: any;
}

export const Sidebar: React.FC<Props> = ({
  groupId,
  value,
  updatedTime,
  handleTime
}) => {
  const [width, setWidth] = useState(window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const saveDoc = useCallback(() => {
    console.log(value);
    fetch(`http://localhost:4000/docs/${groupId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body: value })
    })
      .then(res => res.json())
      .then(json => handleTime(json.timestamp));
  }, [value, groupId, handleTime]);

  return width >= 1400 ? (
    <div className="sidebar">
      <h2>Shared Docs</h2>
      <p>Edit to see updates in realtime. Save when you want to share.</p>
      <button className="btn save-btn" onClick={saveDoc}>
        Save
      </button>
      <div className="time">
        <p className="left">Last Saved</p>
        <p>{new Date(updatedTime).toLocaleDateString("en-US", dayOptions)}</p>
        <p>{new Date(updatedTime).toLocaleTimeString("en-US", timeOptions)}</p>
      </div>
      <p className="last">
        Create a new page by typing whatever you want after 'docs/' in the
        address bar.
      </p>
    </div>
  ) : (
    <div className="sidebar">
      <p className="title">Shared Docs</p>
      <button className="btn save-btn-mobile" onClick={saveDoc}>
        Save
      </button>
    </div>
  );
};
