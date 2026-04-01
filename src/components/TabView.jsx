// components/TabView.jsx
import { useState } from 'react';

const ICONS = ['☰', '◫'];

export function TabView({ tabs, panels }) {
  const [active, setActive] = useState(0);

  return (
    <div className="tab-view">
      <div className="tab-view__tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`tab-view__tab ${active === i ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span style={{ marginRight: 7, opacity: active === i ? 1 : 0.5 }}>
              {ICONS[i]}
            </span>
            {tab}
          </button>
        ))}
      </div>

      <div
        className="tab-view__panel"
        key={active}
        style={{ animation: 'slideUp .2s cubic-bezier(.4,0,.2,1)' }}
      >
        {panels[active]}
      </div>
    </div>
  );
}