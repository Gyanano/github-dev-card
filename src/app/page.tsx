'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Particles from '@/components/Particles';

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    router.push(`/card?u=${encodeURIComponent(input.trim())}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <Particles />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="text-xs font-mono text-cyan-500 tracking-[0.5em] mb-4 uppercase">System Online // Ready for input</div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter mix-blend-difference mb-2">
            DEV<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-600">CARD</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Analyze your GitHub data. Generate your combat profile. Compete in the global arena.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-lg opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative flex items-center bg-black rounded-lg leading-none">
            <span className="pl-4 text-gray-500 font-mono text-xl">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter GitHub Username..."
              className="w-full p-4 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-lg"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="pr-4 pl-4 py-4 text-cyan-400 font-bold hover:text-white transition-colors uppercase text-sm tracking-wider"
            >
              {isLoading ? 'SCANNING...' : 'EXECUTE'}
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex gap-8 text-[10px] text-gray-600 font-mono uppercase tracking-widest"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Server: Online
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            GitHub API: Public
          </div>
        </motion.div>
      </div>
    </main>
  );
}
