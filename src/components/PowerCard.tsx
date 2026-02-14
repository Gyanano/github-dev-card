'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DevCard } from '@/lib/types';
import StatsRadar from './StatsRadar';

const RankBadge = ({ rank }: { rank: string }) => {
  const colors = {
    S: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
    A: 'text-fuchsia-400 border-fuchsia-400 bg-fuchsia-400/10',
    B: 'text-cyan-400 border-cyan-400 bg-cyan-400/10',
    C: 'text-green-400 border-green-400 bg-green-400/10',
    D: 'text-gray-400 border-gray-400 bg-gray-400/10',
  };
  const style = colors[rank as keyof typeof colors] || colors.D;

  return (
    <div className={`absolute -top-4 -right-4 w-16 h-16 flex items-center justify-center border-2 rounded-xl rotate-12 backdrop-blur-md shadow-[0_0_15px_currentColor] z-30 ${style}`}>
      <span className="text-4xl font-black font-mono">{rank}</span>
    </div>
  );
};

export default function PowerCard({ card, compact = false }: { card: DevCard; compact?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(useSpring(y, { stiffness: 200, damping: 20 }), [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(useSpring(x, { stiffness: 200, damping: 20 }), [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="group relative inline-block"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative ${compact ? 'w-64' : 'w-80'} bg-[#0a0a0f] border border-white/10 rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]`}
      >
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 p-[1px] opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-transparent to-fuchsia-500" 
               style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }} />
        </div>

        {/* Card Content Container */}
        <div className="relative h-full bg-[#08080c] m-[1px]" 
             style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
          
          {/* Header Image Background */}
          <div className="absolute top-0 left-0 w-full h-32 opacity-20 bg-cover bg-center mask-linear-fade"
               style={{ backgroundImage: `url(${card.avatarUrl})` }} />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#08080c]" />

          {/* Holographic Sheen */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none holo-gradient transition-opacity duration-500 z-50 mix-blend-overlay" />

          {/* Main Content */}
          <div className="relative p-5 flex flex-col items-center z-10">
            <RankBadge rank={card.rank} />

            {/* Avatar Hex */}
            <div className="relative w-24 h-24 mt-4 mb-3">
              <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 animate-pulse" />
              <div className="relative w-full h-full p-0.5 bg-gradient-to-br from-cyan-400 to-fuchsia-500"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <img 
                  src={card.avatarUrl} 
                  alt={card.username}
                  className="w-full h-full object-cover bg-black"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                />
              </div>
            </div>

            {/* User Info */}
            <h2 className="text-xl font-bold text-white tracking-wider uppercase mb-0.5 glitch-text" data-text={card.name || card.username}>
              {card.name || card.username}
            </h2>
            <div className="text-xs font-mono text-cyan-400 mb-4 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/30">
              @{card.username}
            </div>

            {/* Stats Radar */}
            {!compact && (
              <div className="w-full mb-4 opacity-90 hover:opacity-100 transition-opacity">
                <StatsRadar stats={card.stats} />
              </div>
            )}

            {/* Compact Stats Grid */}
            {compact && (
              <div className="grid grid-cols-2 gap-2 w-full mb-4 text-xs font-mono">
                 <div className="flex justify-between px-2 py-1 bg-white/5 rounded"><span>ATK</span><span className="text-red-400">{card.stats.attack}</span></div>
                 <div className="flex justify-between px-2 py-1 bg-white/5 rounded"><span>DEF</span><span className="text-blue-400">{card.stats.defense}</span></div>
                 <div className="flex justify-between px-2 py-1 bg-white/5 rounded"><span>MAG</span><span className="text-purple-400">{card.stats.magic}</span></div>
                 <div className="flex justify-between px-2 py-1 bg-white/5 rounded"><span>SPD</span><span className="text-yellow-400">{card.stats.speed}</span></div>
              </div>
            )}

            {/* Total Power */}
            <div className="w-full bg-gradient-to-r from-transparent via-white/5 to-transparent h-px mb-3" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Total Power</span>
              <div className="text-3xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                   style={{ textShadow: '0 0 20px rgba(0,243,255,0.3)' }}>
                {card.stats.totalPower}
              </div>
            </div>
            
            {!compact && (
               <div className="mt-4 w-full grid grid-cols-3 text-center gap-2">
                 <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col">
                   <span className="text-xs text-gray-500 uppercase">Repos</span>
                   <span className="font-mono font-bold">{card.totalRepos}</span>
                 </div>
                 <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col">
                   <span className="text-xs text-gray-500 uppercase">Stars</span>
                   <span className="font-mono font-bold text-yellow-500">{card.totalStars}</span>
                 </div>
                 <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col">
                    <span className="text-xs text-gray-500 uppercase">Lang</span>
                    <span className="font-mono font-bold text-fuchsia-400">{Object.keys(card.languages).length}</span>
                 </div>
               </div>
            )}
          </div>
          
          {/* Decorative Corner Lines */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-500/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-cyan-500/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-fuchsia-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-fuchsia-500/50" />
        </div>
      </motion.div>
    </motion.div>
  );
}
