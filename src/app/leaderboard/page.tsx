'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { getLeaderboard } from '@/lib/storage';
import LeaderboardTable from '@/components/LeaderboardTable';
import Particles from '@/components/Particles';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen p-8 pt-24">
      <Particles />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">GLOBAL RANKINGS</h1>
            <p className="text-gray-500 font-mono text-sm uppercase">Top performing developers</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-cyan-400 font-bold">{entries.length}</div>
            <div className="text-[10px] text-gray-600 uppercase">Agents Listed</div>
          </div>
        </div>

        {loading ? (
          <div className="w-full h-64 flex items-center justify-center text-cyan-500 font-mono animate-pulse">
            [FETCHING DATABASE...]
          </div>
        ) : (
          <LeaderboardTable entries={entries} />
        )}
      </div>
    </main>
  );
}
