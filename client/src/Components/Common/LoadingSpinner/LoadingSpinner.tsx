import React from 'react';
import loadingGif from 'Assets/loading-spinner.gif';
import './LoadingSpinner.scss';

export const LoadingSpinner = () => {
  return (
    <img className="loadingSpinner" src={loadingGif} alt="loading" />
  );
};
