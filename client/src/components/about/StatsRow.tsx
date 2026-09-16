import React from 'react';

export const StatsRow: React.FC = () => {
  return (
    <div className="mission-row">
      <div className="mission-card">
        <div className="num">5</div>
        <div className="lbl">Departments Covered</div>
      </div>
      <div className="mission-card">
        <div className="num">1,200+</div>
        <div className="lbl">Resources Shared</div>
      </div>
      <div className="mission-card">
        <div className="num">0</div>
        <div className="lbl">More WhatsApp Forwards</div>
      </div>
    </div>
  );
};
