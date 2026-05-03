/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { Trophy, Zap, ShieldAlert } from 'lucide-react';

interface ArenaProps {
  money: number;
  wins: number;
  power: number;
  hp: number;
  maxHP: number;
  isHM: boolean;
  onHit: () => void;
  onToggleHM: () => void;
}

export default function Arena({ 
  money, 
  wins, 
  power, 
  hp, 
  maxHP, 
  isHM, 
  onHit, 
  onToggleHM 
}: ArenaProps) {
  const controls = useAnimation();

  const handleHit = () => {
    onHit();
    controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.05 }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 bg-[#010101]">
      <div className="text-center space-y-2">
        <motion.h1 
          key={money}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl sm:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]"
        >
          ${Math.floor(money).toLocaleString()}
        </motion.h1>
        
        <div className="flex items-center justify-center gap-6 text-neutral-400 font-bold uppercase tracking-widest text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Power: <span className="text-white">{power.toFixed(1)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-green-400" />
            <span>Wins: <span className="text-white">{wins}</span></span>
          </div>
        </div>
      </div>

      <div className="relative group">
        {/* HP Bar */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-[200px] h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            className="h-full bg-red-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(hp / maxHP) * 100}%` }}
          />
        </div>

        <motion.button
          animate={controls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleHit}
          className="relative w-64 h-64 sm:w-80 sm:h-80 cursor-pointer overflow-hidden border-4 border-white shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-2xl"
        >
          <div className="absolute inset-0 flex">
            <div className={`w-1/2 h-full transition-colors duration-300 ${isHM ? 'bg-red-900/80' : 'bg-blue-600'}`} />
            <div className={`w-1/2 h-full transition-colors duration-300 ${isHM ? 'bg-orange-600' : 'bg-red-500'}`} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-black text-xl drop-shadow-md">ATTACK</span>
          </div>
        </motion.button>
      </div>

      <button
        onClick={onToggleHM}
        className={`px-8 py-4 rounded-full flex items-center gap-3 font-bold transition-all border-2 ${
          isHM 
            ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
            : 'bg-white/5 border-neutral-700 text-neutral-400 hover:border-neutral-500'
        }`}
      >
        <ShieldAlert className={`w-5 h-5 ${isHM ? 'animate-pulse' : ''}`} />
        <span>HARD MODE: {isHM ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  );
}
