/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Skull, RefreshCw, HeartPulse } from 'lucide-react';
import { REVIVE_COST } from '../constants';

interface DeathScreenProps {
  message: string;
  money: number;
  onRevive: () => void;
  onRestart: () => void;
}

export default function DeathScreen({ message, money, onRevive, onRestart }: DeathScreenProps) {
  const canRevive = money >= REVIVE_COST;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#1a0000] flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="space-y-8 max-w-md w-full"
      >
        <div className="flex justify-center">
          <div className="p-6 bg-red-600 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.6)]">
            <Skull className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">
            Terminated
          </h1>
          <p className="text-red-400 font-bold uppercase tracking-[0.2em] text-sm animate-pulse">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            disabled={!canRevive}
            onClick={onRevive}
            className={`group relative py-5 px-8 rounded-xl font-black text-xl flex items-center justify-center gap-3 transition-all ${
              canRevive 
                ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl' 
                : 'bg-white/5 text-white/20 border-2 border-white/10'
            }`}
          >
            <HeartPulse className={`w-6 h-6 ${canRevive ? 'text-red-600' : ''}`} />
            <span>CONTINUE (${REVIVE_COST.toLocaleString()})</span>
            {!canRevive && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-red-500/60 font-bold w-full">
                INSUFFICIENT FUNDS
              </span>
            )}
          </button>

          <button
            onClick={onRestart}
            className="py-4 px-8 rounded-xl font-bold bg-transparent border-2 border-white/20 text-white/60 hover:bg-white/10 hover:border-white/40 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RESTART GAME</span>
          </button>
        </div>
      </motion.div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2)_0%,transparent_70%)]" />
      </div>
    </motion.div>
  );
}
