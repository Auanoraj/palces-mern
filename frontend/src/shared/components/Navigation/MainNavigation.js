import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader.js";
import NavLinks from "./NavLinks.js";
import SideDrawer from "./SideDrawer.js";
import BackDrop from "../UIElements/BackDrop.js";

import "../../styles/Navigation/MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <React.Fragment>
      {drawerIsOpen && <BackDrop onClick={() => setDrawerIsOpen(false)} />}
      <SideDrawer
        className="main-navigation__drawer-nav"
        show={drawerIsOpen}
        sideDrawerClicked={() => setDrawerIsOpen(false)}
      >
        <NavLinks />
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={() => setDrawerIsOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
