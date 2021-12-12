import React from "react";

import './EndGameModal.css';

const EndGameModal = ({ endGameText }) => {
  return  ( 
    <div className="modal-wrapper">
      <div className="modal animation">
        {endGameText}
      </div>
    </div>
  );
};

export default EndGameModal;
