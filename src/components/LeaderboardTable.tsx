'use client';

import { LeaderboardEntry } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-1 text-center">Rank</div>
        <div className="col-span-4">Operator</div>
        <div className="col-span-2 text-center">Class</div>
        <div className="col-span-3 text-right">Combat Power</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      <div className="flex flex-col">
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors group"
          >
            {/* Rank */}
            <div className="col-span-1 flex justify-center">
              {idx < 3 ? (
                <span className={`text-xl ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : 'text-amber-700'}`}>
                  {idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="font-mono text-gray-500">#{idx + 1}</span>
              )}
            </div>

            {/* Operator */}
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full rounded bg-gray-800 object-cover" />
                <div className="absolute inset-0 border border-white/20 rounded" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{entry.name}</span>
                <span className="text-xs text-gray-500 font-mono truncate">@{entry.username}</span>
              </div>
            </div>

            {/* Class/Rank */}
            <div className="col-span-2 text-center">
              <span className={`font-black text-lg rank-${entry.rank}`}>
                {entry.rank}
              </span>
            </div>

            {/* Power */}
            <div className="col-span-3 text-right">
              <span className="font-mono font-bold text-cyan-300 text-lg">
                {entry.totalPower.toLocaleString()}
              </span>
            </div>

            {/* Action */}
            <div className="col-span-2 flex justify-center">
              <Link 
                href={`/card/${entry.username}`}
                className="text-[10px] uppercase font-bold px-3 py-1 rounded border border-white/20 hover:bg-white hover:text-black transition-colors"
              >
                Inspect
              </Link>
            </div>
          </motion.div>
        ))}
        
        {entries.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                NO DATA FOUND // SYSTEM IDLE
            </div>
        )}
      </div>
    </div>
  );
}
