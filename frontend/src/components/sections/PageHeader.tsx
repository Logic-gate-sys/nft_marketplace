import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="border-b border-os-border bg-os-bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-os-text-primary mb-2">
              {title}
            </h1>
            <p className="text-os-text-secondary">{description}</p>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
