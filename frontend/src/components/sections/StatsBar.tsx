import React from 'react';

export interface Stat {
  label: string;
  value: string | number;
}

interface StatsBarProps {
  stats: Stat[];
  action?: React.ReactNode;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats, action }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-6">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div>
              <p className="text-xs text-os-text-tertiary mb-1">{stat.label}</p>
              <p className="text-lg font-semibold text-os-text-primary">
                {stat.value}
              </p>
            </div>
            {index < stats.length - 1 && (
              <div className="h-8 w-px bg-os-border" />
            )}
          </React.Fragment>
        ))}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default StatsBar;
