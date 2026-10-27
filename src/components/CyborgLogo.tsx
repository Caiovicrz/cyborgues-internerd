import React from 'react';

interface CyborgLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CyborgLogo: React.FC<CyborgLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <img
        src="/assets/aistudio/image_1__114eeea8.png"
        alt="A.A.A. Eng. de Computação Cyborgues UEMA"
        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(234,179,8,0.45)] select-none"
      />
    </div>
  );
};
