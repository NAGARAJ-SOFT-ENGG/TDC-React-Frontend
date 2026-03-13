import React from 'react';
import { LOGO } from '@assets';

export const LogoSpinner = ({ size = 'w-16 h-16' }) => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white z-50 fixed top-0 left-0">
      <div className={`relative ${size}`}>
        <img
          src={LOGO}
          alt="Loading..."
          className="w-full h-full object-contain animate-spin"
        />
        <div className="shine-overlay absolute inset-0 pointer-events-none" />
      </div>
    </div>
  );
};
