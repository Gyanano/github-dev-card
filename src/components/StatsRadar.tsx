'use client';

import { DevStats } from '@/lib/types';

export default function StatsRadar({ stats }: { stats: DevStats }) {
  const size = 180;
  const center = size / 2;
  const radius = 70;
  
  // Calculate points
  const keys = ['attack', 'defense', 'magic', 'speed', 'luck'] as const;
  const total = keys.length;
  const angleStep = (Math.PI * 2) / total;
  
  const points = keys.map((key, i) => {
    const value = stats[key]; // 0-100
    const angle = i * angleStep - Math.PI / 2; // Start at top
    const dist = (value / 100) * radius;
    const x = center + Math.cos(angle) * dist;
    const y = center + Math.sin(angle) * dist;
    return `${x},${y}`;
  }).join(' ');

  const gridPoints = [100, 75, 50, 25].map(pct => {
    return keys.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const dist = (pct / 100) * radius;
      const x = center + Math.cos(angle) * dist;
      const y = center + Math.sin(angle) * dist;
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <div className="relative w-full flex justify-center items-center py-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Radar Background Grid */}
        {gridPoints.map((pts, i) => (
          <polygon 
            key={i} 
            points={pts} 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeDasharray="2 2"
            strokeWidth="1" 
          />
        ))}
        
        {/* Connectors from center */}
        {keys.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <line 
              key={i} 
              x1={center} 
              y1={center} 
              x2={x} 
              y2={y} 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Data Area */}
        <polygon 
          points={points} 
          fill="rgba(0, 243, 255, 0.2)" 
          stroke="var(--primary-cyan)" 
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]"
        />

        {/* Data Points */}
        {keys.map((key, i) => {
          const value = stats[key];
          const angle = i * angleStep - Math.PI / 2;
          const dist = (value / 100) * radius;
          const x = center + Math.cos(angle) * dist;
          const y = center + Math.sin(angle) * dist;
          return (
            <circle 
              key={i} 
              cx={x} 
              cy={y} 
              r="3" 
              fill="#fff"
              stroke="var(--primary-magenta)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      
      {/* Floating Labels */}
      {keys.map((key, i) => {
        // We use absolute positioning for labels to handle text better than SVG text
        // Position roughly around the circle
        const angle = i * angleStep - Math.PI / 2;
        // Push labels out a bit further than radius
        const labelRadius = radius + 20; 
        const x = center + Math.cos(angle) * labelRadius;
        const y = center + Math.sin(angle) * labelRadius;
        
        // CSS transform to center the div on the coordinate
        const style = {
          left: `${(x / size) * 100}%`,
          top: `${(y / size) * 100}%`,
          transform: 'translate(-50%, -50%)'
        };

        const icons = { attack: '⚔️', defense: '🛡️', magic: '🔮', speed: '⚡', luck: '🍀' };

        return (
          <div key={key} className="absolute text-[10px] font-bold uppercase tracking-wider text-cyan-200 flex flex-col items-center" style={style}>
            <span className="text-xs opacity-80">{icons[key]}</span>
            {key.substring(0, 3)}
          </div>
        );
      })}
    </div>
  );
}
