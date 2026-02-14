'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import BattleArena from '@/components/BattleArena';
import { DevCard } from '@/lib/types';
import { generateCard } from '@/lib/card-generator';
import Particles from '@/components/Particles';

function BattleSetup() {
  const searchParams = useSearchParams();
  const p1Default = searchParams.get('p1') || '';

  const [p1, setP1] = useState(p1Default);
  const [p2, setP2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [card1, setCard1] = useState<DevCard | null>(null);
  const [card2, setCard2] = useState<DevCard | null>(null);
  const [inBattle, setInBattle] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1 || !p2) return;

    setLoading(true);
    setError('');

    try {
      const [c1, c2] = await Promise.all([
        generateCard(p1.trim()),
        generateCard(p2.trim()),
      ]);
      setCard1(c1);
      setCard2(c2);
      setInBattle(true);
    } catch {
      setError('Failed to load player data. Check usernames.');
    } finally {
      setLoading(false);
    }
  };

  if (inBattle && card1 && card2) {
    return (
      <div className="w-full flex flex-col items-center">
        <BattleArena player1={card1} player2={card2} />
        <button
          onClick={() => setInBattle(false)}
          className="mt-8 px-6 py-2 border border-white/20 text-sm text-gray-400 hover:text-white transition-colors"
        >
          RESET MATCH
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          BATTLE ARENA
        </h1>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
          Select two combatants to simulate a duel
        </p>
      </motion.div>

      <form onSubmit={handleStart} className="w-full grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        <div className="md:col-span-3">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl relative group focus-within:border-cyan-500 transition-colors">
            <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase">Challenger 01</label>
            <input
              value={p1}
              onChange={e => setP1(e.target.value)}
              placeholder="Username"
              className="w-full bg-transparent text-xl font-mono text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-1 flex justify-center text-2xl font-black text-gray-700 select-none">VS</div>

        <div className="md:col-span-3">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl relative group focus-within:border-fuchsia-500 transition-colors">
            <label className="block text-xs font-bold text-fuchsia-500 mb-2 uppercase">Challenger 02</label>
            <input
              value={p2}
              onChange={e => setP2(e.target.value)}
              placeholder="Username"
              className="w-full bg-transparent text-xl font-mono text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col items-center mt-8">
          <button
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-black text-xl tracking-widest rounded skew-x-[-10deg] hover:scale-105 transition-transform disabled:opacity-50"
          >
            <span className="skew-x-[10deg] inline-block">{loading ? 'INITIALIZING...' : 'FIGHT'}</span>
          </button>
          {error && <p className="mt-4 text-red-500 font-mono text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
}

export default function BattlePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-grid-moving">
      <Particles />
      <div className="relative z-10 w-full">
        <Suspense fallback={<div className="text-center text-cyan-500 font-mono">LOADING MODULE...</div>}>
          <BattleSetup />
        </Suspense>
      </div>
    </main>
  );
}
