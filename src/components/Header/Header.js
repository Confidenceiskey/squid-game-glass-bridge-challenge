import React from "react";

import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="title">SQUID GAME: Glass Bridge Challenge</div>
      <div className="subtitle">Can you get 5 players across the bridge in 60s?</div>
      <div className="author">Made by <a className="link" href="/">David Nowak</a></div>
    </div>
  );
};

export default Header;
