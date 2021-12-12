import React from "react";

import './Footer.css';

const Footer = ({ statusOfPlayers, playersAliveCount }) => {
  return (
    <div className='footer'>
      <div className='status-summary'>
        <div className='description-text'>
          Alive Players
        </div>
        <div className='player-count'>
          {playersAliveCount}
        </div>
      </div>
      <div className='players-remaining-container'>
        {statusOfPlayers.map(([playerNumber, status]) => (
          <div key={`player-${playerNumber}`} className="player-box player">
            <div className={`${status} player size`}>
              {playerNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;