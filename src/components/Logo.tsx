
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="relative w-10 h-10 mr-2">
        <div className="absolute inset-0 bg-primary rounded-md animate-scale-in"></div>
        <div className="absolute inset-[2px] bg-white rounded-md flex items-center justify-center text-primary font-bold text-lg">
          GD
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-foreground">Gestão Digital</span>
        <span className="text-xs text-muted-foreground">de Estágios</span>
      </div>
    </div>
  );
};

export default Logo;
