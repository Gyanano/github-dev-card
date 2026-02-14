'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DevCard, BattleResult } from '@/lib/types';
import PowerCard from './PowerCard';

function computeBattle(p1: DevCard, p2: DevCard): BattleResult {
  const statKeys = ['attack', 'defense', 'magic', 'speed', 'luck'] as const;
  const details = statKeys.map(key => {
    const v1 = p1.stats[key];
    const v2 = p2.stats[key];
    return {
      stat: key,
      player1: v1,
      player2: v2,
      winner: (v1 > v2 ? 1 : v1 < v2 ? 2 : 0) as 0 | 1 | 2
    };
  });
  
  const s1 = details.filter(d => d.winner === 1).length;
  const s2 = details.filter(d => d.winner === 2).length;
  
  return {
    winner: s1 > s2 ? p1.username : s2 > s1 ? p2.username : 'draw',
    loser: s1 > s2 ? p2.username : s2 > s1 ? p1.username : 'draw',
    details,
    player1Score: s1,
    player2Score: s2
  };
}

export default function BattleArena({ player1, player2 }: { player1: DevCard; player2: DevCard }) {
  const [phase, setPhase] = useState<'intro' | 'comparing' | 'result'>('intro');
  const [currentStatIndex, setCurrentStatIndex] = useState(-1);
  const [result, setResult] = useState<BattleResult | null>(null);
  
  useEffect(() => {
    // Start Battle Sequence
    setResult(computeBattle(player1, player2));
    
    const introTimer = setTimeout(() => {
      setPhase('comparing');
      let idx = 0;
      const interval = setInterval(() => {
        setCurrentStatIndex(idx);
        idx++;
        if (idx >= 5) {
          clearInterval(interval);
          setTimeout(() => setPhase('result'), 1000);
        }
      }, 1200); // Time per stat
    }, 2500); // Intro duration
    
    return () => clearTimeout(introTimer);
  }, [player1, player2]);

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden bg-black/40 border border-white/5 rounded-3xl backdrop-blur-sm">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 animate-pulse" />

      {/* VS OVERLAY - INTRO */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div 
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-yellow-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]">
              VS
            </div>
            <div className="text-2xl font-mono text-white tracking-[1em] mt-4">READY</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-center justify-between w-full px-8 md:px-16 gap-12 relative z-10">
        
        {/* PLAYER 1 */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`transition-all duration-500 ${phase === 'result' && result?.winner === player2.username ? 'opacity-30 blur-sm grayscale' : ''}`}
        >
          <div className="flex flex-col items-center gap-4">
             <div className="text-cyan-400 font-bold tracking-widest text-sm border-b border-cyan-500/50 pb-1 mb-2">PLAYER 01</div>
             <PowerCard card={player1} compact />
             {phase === 'result' && result?.winner === player1.username && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                 <div className="bg-yellow-500 text-black font-black text-xl px-4 py-1 -rotate-12 border-4 border-white shadow-xl">WINNER</div>
               </motion.div>
             )}
          </div>
        </motion.div>

        {/* CENTER STAGE - STAT COMPARISON */}
        <div className="flex-1 w-full max-w-md h-[400px] flex flex-col items-center justify-center relative">
          {phase === 'comparing' && currentStatIndex >= 0 && result && (
            <div className="w-full flex flex-col gap-4">
               {result.details.map((detail, i) => {
                 if (i > currentStatIndex) return null;
                 const isLatest = i === currentStatIndex;
                 return (
                   <motion.div 
                     layout
                     key={detail.stat}
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: isLatest ? 1.1 : 1, opacity: isLatest ? 1 : 0.6 }}
                     className="flex items-center justify-between w-full bg-white/5 p-3 rounded border border-white/10"
                   >
                     {/* P1 Val */}
                     <span className={`font-mono font-bold text-xl w-12 text-right ${detail.winner === 1 ? 'text-cyan-400' : 'text-gray-600'}`}>
                       {detail.player1}
                     </span>

                     {/* Stat Name */}
                     <div className="flex flex-col items-center w-24">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">{detail.stat}</span>
                        {isLatest && (
                          <motion.div 
                             initial={{ width: '0%' }} animate={{ width: '100%' }} 
                             className={`h-0.5 mt-1 ${detail.winner === 1 ? 'bg-gradient-to-r from-cyan-500 to-transparent' : 'bg-gradient-to-l from-fuchsia-500 to-transparent'}`}
                          />
                        )}
                     </div>

                     {/* P2 Val */}
                     <span className={`font-mono font-bold text-xl w-12 text-left ${detail.winner === 2 ? 'text-fuchsia-400' : 'text-gray-600'}`}>
                       {detail.player2}
                     </span>
                   </motion.div>
                 );
               })}
            </div>
          )}

          {phase === 'result' && result && (
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center"
             >
                <div className="text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                  {result.player1Score} - {result.player2Score}
                </div>
                <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">Final Score</div>
             </motion.div>
          )}
        </div>

        {/* PLAYER 2 */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`transition-all duration-500 ${phase === 'result' && result?.winner === player1.username ? 'opacity-30 blur-sm grayscale' : ''}`}
        >
          <div className="flex flex-col items-center gap-4">
             <div className="text-fuchsia-400 font-bold tracking-widest text-sm border-b border-fuchsia-500/50 pb-1 mb-2">PLAYER 02</div>
             <PowerCard card={player2} compact />
             {phase === 'result' && result?.winner === player2.username && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                 <div className="bg-yellow-500 text-black font-black text-xl px-4 py-1 rotate-12 border-4 border-white shadow-xl">WINNER</div>
               </motion.div>
             )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
