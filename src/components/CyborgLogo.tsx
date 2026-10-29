import React, { useState } from 'react';
import cyborgLogoImg from '../assets/cyborgues-logo.png';

interface CyborgLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export { cyborgLogoImg };

export const CyborgLogo: React.FC<CyborgLogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32 sm:w-44 sm:h-44',
    '2xl': 'w-48 h-48 sm:w-60 sm:h-60',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {!imgError ? (
        <img
          src={cyborgLogoImg}
          alt="Atlética Cyborgues UEMA"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(234,179,8,0.5)] select-none pointer-events-none"
          loading="eager"
        />
      ) : (
        /* Stylish vectorized cyber badge fallback in case of missing asset */
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
          <div className="w-full h-full bg-neutral-950 rounded-[14px] flex flex-col items-center justify-center p-1 text-center border border-amber-400/40">
            <span className="font-heading font-black text-amber-400 text-[10px] sm:text-xs tracking-wider leading-none">
              CYBORGUES
            </span>
            <span className="text-[8px] font-cyber text-neutral-400 mt-0.5">UEMA</span>
          </div>
        </div>
      )}
    </div>
  );
};
