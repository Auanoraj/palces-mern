import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "../../styles/Navigation/SideDrawer.css";

const SideDrawer = (props) => {
  let content = (
    <CSSTransition in={props.show} timeout={200} mountOnEnter unmountOnExit>
      <aside className="side-drawer" onClick={props.sideDrawerClicked}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
