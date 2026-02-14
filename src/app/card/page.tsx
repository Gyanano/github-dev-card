'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DevCard } from '@/lib/types';
import { generateCard } from '@/lib/card-generator';
import PowerCard from '@/components/PowerCard';
import Particles from '@/components/Particles';

function CardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get('u') || '';
  const [card, setCard] = useState<DevCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }
    generateCard(username)
      .then(setCard)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-cyan-500 font-mono">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <div className="animate-pulse">ANALYZING GITHUB DATA...</div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold mb-4">SYSTEM ERROR: {error}</h1>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 border border-red-500/50 hover:bg-red-500/10 text-red-400 rounded transition-colors"
        >
          RETURN TO BASE
        </button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-grid-moving">
      <Particles />
      <div className="relative z-10 flex flex-col items-center gap-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <PowerCard card={card} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <button
            onClick={() => router.push(`/battle?p1=${username}`)}
            className="group relative px-8 py-3 bg-red-600/20 border border-red-500/50 text-red-400 font-bold uppercase tracking-wider overflow-hidden hover:text-white transition-colors"
          >
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-[-1]" />
            Initiate Combat
          </button>
        </motion.div>
      </div>
    </main>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center text-cyan-500 font-mono">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <div className="animate-pulse">LOADING...</div>
      </div>
    }>
      <CardContent />
    </Suspense>
  );
}
