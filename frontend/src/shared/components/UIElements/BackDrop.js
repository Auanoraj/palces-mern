import React from "react";
import ReactDOM from "react-dom";

import "../../styles/UIElements/BackDrop.css";

const BackDrop = (props) => {
  let content = <div className="backdrop" onClick={props.onClick}></div>;

  return ReactDOM.createPortal(
    content,
    document.getElementById("backdrop-hook")
  );
};

export default BackDrop;
