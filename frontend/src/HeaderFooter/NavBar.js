import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const root = document.getElementById("root");
  const isAuth =
    root &&
    root.getAttribute("value") !== null &&
    root.getAttribute("value") !== "";

  const renderNavLinks = () => {
    if (isAuth)
      return (
        <>
          <Link to="/">Home</Link>&nbsp;-&nbsp;
          <Link to="/add">Add Source</Link>&nbsp;-&nbsp;
          <Link to="/help">Help</Link>&nbsp;-&nbsp;
          <a href="/accounts/logout/">Logout</a>
        </>
      );
    return (
      <>
        <Link to="/">Home</Link>&nbsp;-&nbsp;
        <a href="/accounts/login/">Login</a>&nbsp;-&nbsp;
        <a href="/accounts/register/">Register</a>
      </>
    );
  };

  return (
    <div className="container-fluid main-nav">
      <div className="container">
        <div className="row">
          <div className="col d-flex align-items-center">
            <div>
              <Link to="/">
                <img src="static/images/v.png" width={48} />
              </Link>
            </div>
            <div className="mx-3">
              <span style={{ fontSize: 32 }}>Vigilio Sources</span>
            </div>
          </div>
          <div className="col d-flex justify-content-end">
            <div className="d-flex align-items-center">{renderNavLinks()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
