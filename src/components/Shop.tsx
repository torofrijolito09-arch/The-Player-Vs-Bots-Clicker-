/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Lock, ArrowBigUp } from 'lucide-react';
import { UPGRADES, AUTO_BOT_COST, HARD_MODE_COST_MULT } from '../constants';

interface ShopProps {
  money: number;
  wins: number;
  isHM: boolean;
  autoLvl: number;
  costs: Record<string, number>;
  onBuy: (id: string) => void;
}

export default function Shop({ money, wins, isHM, autoLvl, costs, onBuy }: ShopProps) {
  return (
    <div className="h-44 bg-black/95 border-b-2 border-green-500/30 overflow-x-auto overflow-y-hidden flex items-center p-4 gap-4 scrollbar-hide">
      <div className="flex-shrink-0 h-full flex flex-col justify-center px-4 border-r border-white/10">
        <ShoppingCart className="w-6 h-6 text-green-400 mb-1" />
        <span className="text-[10px] font-black uppercase text-neutral-500">Shop</span>
      </div>

      {UPGRADES.map((upgrade) => {
        const isLocked = upgrade.requiresWins && wins < upgrade.requiresWins;
        const currentPrice = costs[upgrade.id];
        const canAfford = money >= currentPrice;

        return (
          <motion.button
            key={upgrade.id}
            whileHover={!isLocked && canAfford ? { y: -4 } : {}}
            whileTap={!isLocked && canAfford ? { scale: 0.95 } : {}}
            onClick={() => !isLocked && onBuy(upgrade.id)}
            className={`flex-shrink-0 w-44 h-full rounded-xl border flex flex-col justify-between p-3 transition-all ${
              isLocked 
                ? 'bg-black opacity-20 filter grayscale border-neutral-800' 
                : canAfford 
                  ? 'bg-neutral-900 border-neutral-700 hover:border-green-500 shadow-lg' 
                  : 'bg-neutral-900/50 border-neutral-800 opacity-60'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <div className="flex justify-between items-start w-full gap-2">
                <b className="text-xs uppercase tracking-wider text-green-400 truncate flex-1">
                  {upgrade.name}
                </b>
                <span className={`text-[10px] font-black whitespace-nowrap ${canAfford ? 'text-yellow-400' : 'text-neutral-500'}`}>
                  {currentPrice.toLocaleString()} BC
                </span>
              </div>
              <span className="text-[10px] font-medium text-neutral-500 mt-1">
                {upgrade.description}
              </span>
            </div>

            <div className={`text-[10px] py-1.5 rounded text-center font-black tracking-widest ${
              isLocked ? 'bg-red-500/20 text-red-400' : canAfford ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-neutral-800 text-neutral-500'
            }`}>
              {isLocked ? `LOCKED: ${upgrade.requiresWins} WINS` : 'UPGRADE'}
            </div>
          </motion.button>
        );
      })}

      {/* Auto Bot Upgrade */}
      <motion.button
        key="auto-bot"
        whileHover={autoLvl < 3 && money >= costs['auto'] ? { y: -4 } : {}}
        whileTap={autoLvl < 3 && money >= costs['auto'] ? { scale: 0.95 } : {}}
        onClick={() => onBuy('auto')}
        className={`flex-shrink-0 w-44 h-full rounded-xl border flex flex-col justify-between p-3 transition-all ${
          autoLvl >= 3 
            ? 'bg-blue-900/20 border-blue-500/50' 
            : money >= costs['auto'] 
              ? 'bg-neutral-900 border-neutral-700 hover:border-blue-500 shadow-lg' 
              : 'bg-neutral-900/50 border-neutral-800 opacity-60'
        }`}
      >
        <div className="flex flex-col items-start text-left">
          <div className="flex justify-between items-start w-full gap-2">
            <b className="text-xs uppercase tracking-wider text-blue-400 truncate flex-1">
              Auto-Bot
            </b>
            <span className={`text-[10px] font-black whitespace-nowrap ${money >= costs['auto'] ? 'text-blue-300' : 'text-neutral-500'}`}>
              {autoLvl >= 3 ? 'MAX' : `${costs['auto'].toLocaleString()} BC`}
            </span>
          </div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map(lvl => (
              <div key={lvl} className={`w-2 h-1 rounded-full ${autoLvl >= lvl ? 'bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]' : 'bg-neutral-700'}`} />
            ))}
          </div>
        </div>

        <div className={`text-[10px] py-1.5 rounded text-center font-black tracking-widest ${
          autoLvl >= 3 ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30' : money >= costs['auto'] ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-neutral-800 text-neutral-500'
        }`}>
          {autoLvl === 0 ? 'ACTIVATE' : autoLvl >= 3 ? 'MAX LEVEL' : 'UPGRADE'}
        </div>
      </motion.button>
    </div>
  );
}
