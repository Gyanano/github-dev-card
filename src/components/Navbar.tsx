'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();

  const navs = [
    { label: 'GENERATE', path: '/' },
    { label: 'BATTLE', path: '/battle' },
    { label: 'RANKING', path: '/leaderboard' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 h-16 border-b border-white/5 backdrop-blur-md bg-black/50"
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="font-bold tracking-widest text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-cyan-400 transition-all">
            DEV<span className="text-cyan-400">.CARD</span>
          </span>
        </Link>

        <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {navs.map((nav) => {
            const isActive = pathname === nav.path || (nav.path !== '/' && pathname.startsWith(nav.path));
            return (
              <Link key={nav.path} href={nav.path} className="relative px-5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors z-10">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full z-[-1]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={isActive ? 'text-black' : 'text-gray-400 hover:text-white'}>
                  {nav.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
