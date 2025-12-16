import React from 'react';

interface CardGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const CardGrid: React.FC<CardGridProps> = ({ children,  cols = { sm: 4, md: 4, lg: 6, xl: 8 } }) => {
  const gridCols = `  grid-cols-${cols.sm || 4}  md:grid-cols-${cols.md || 5} lg:grid-cols-${cols.lg || 6} xl:grid-cols-${cols.xl || 8} `;

  return (
    <div className={`grid gap-3 ${gridCols}`}>
      {children}
    </div>
  );
};

export default CardGrid;
