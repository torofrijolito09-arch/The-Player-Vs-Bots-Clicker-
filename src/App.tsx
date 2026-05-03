/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Arena from './components/Arena';
import Shop from './components/Shop';
import ChaseUI from './components/ChaseUI';
import DeathScreen from './components/DeathScreen';
import { GameState, ChaseMode } from './types';
import { 
  UPGRADES, 
  AUTO_BOT_COST, 
  AUTO_BOT_INTERVALS, 
  REVIVE_COST, 
  HARD_MODE_COST_MULT, 
  HARD_MODE_POWER_MULT 
} from './constants';

export default function App() {
  // Core State
  const [money, setMoney] = useState(5);
  const [wins, setWins] = useState(0);
  const [power, setPower] = useState(1);
  const [hp, setHP] = useState(50);
  const [maxHP, setMaxHP] = useState(50);
  const [autoLvl, setAutoLvl] = useState(0);
  const [upgradeLevels, setUpgradeLevels] = useState<Record<string, number>>({
    tool: 0,
    hacker: 0,
    turret: 0,
    ship: 0
  });
  const [isHM, setIsHM] = useState(false);
  
  // UI State
  const [gameState, setGameState] = useState<GameState>('ARENA');
  const [chaseMode, setChaseMode] = useState<ChaseMode>('LIGHT');
  const [deathMessage, setDeathMessage] = useState('');

  // Helper to get cost
  const getUpgradeCost = (id: string) => {
    const mult = isHM ? HARD_MODE_COST_MULT : 1;
    if (id === 'auto') {
      return Math.floor(AUTO_BOT_COST * mult * Math.pow(1.2, autoLvl));
    }
    const upgrade = UPGRADES.find(u => u.id === id);
    if (!upgrade) return 0;
    const level = upgradeLevels[id] || 0;
    return Math.floor(upgrade.baseCost * mult * Math.pow(1.2, level));
  };

  // Auto Bot Effect
  useEffect(() => {
    if (autoLvl === 0 || gameState !== 'ARENA') return;
    
    const interval = AUTO_BOT_INTERVALS[autoLvl];
    const timer = setInterval(() => {
      const p = isHM ? (power * HARD_MODE_POWER_MULT) : power;
      setMoney(prev => prev + (p * 0.1));
    }, interval);

    return () => clearInterval(timer);
  }, [autoLvl, power, isHM, gameState]);

  const handleHit = useCallback(() => {
    const p = isHM ? (power * HARD_MODE_POWER_MULT) : power;
    setMoney(prev => prev + p);
    setHP(prev => {
      const next = prev - p;
      if (next <= 0) {
        const nextWins = wins + 1;
        setWins(nextWins);
        const nextMax = maxHP + 100;
        
        // Chase triggers: At 20 (Light), At 30 (Fire)
        // Using modulo to allow repeatability or just first time?
        // User said "At 20 wins... At 30 wins", usually means repeatable milestones in these games
        if (nextWins > 0 && nextWins % 30 === 0) {
          setChaseMode('FIRE');
          setGameState('CHASE');
        } else if (nextWins > 0 && nextWins % 20 === 0) {
          setChaseMode('LIGHT');
          setGameState('CHASE');
        }
        
        return nextMax;
      }
      return next;
    });
  }, [power, isHM, wins, maxHP]);

  const handleBuy = (id: string) => {
    const cost = getUpgradeCost(id);
    if (money < cost) return;

    if (id === 'auto') {
      if (autoLvl < 3) {
        setMoney(prev => prev - cost);
        setAutoLvl(prev => prev + 1);
      }
      return;
    }

    const upgrade = UPGRADES.find(u => u.id === id);
    if (!upgrade) return;
    if (upgrade.requiresWins && wins < upgrade.requiresWins) return;

    setMoney(prev => prev - cost);
    setPower(prev => prev + upgrade.powerGain);
    setUpgradeLevels(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleChaseWin = () => {
    setGameState('ARENA');
    setMoney(prev => prev + 10000);
  };

  const handleDie = (msg: string) => {
    setDeathMessage(msg);
    setGameState('DEATH');
  };

  const handleRevive = () => {
    if (money >= REVIVE_COST) {
      setMoney(prev => prev - REVIVE_COST);
      setGameState('CHASE');
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  // Pre-calculate costs for the shop
  const currentCosts = {
    tool: getUpgradeCost('tool'),
    hacker: getUpgradeCost('hacker'),
    turret: getUpgradeCost('turret'),
    ship: getUpgradeCost('ship'),
    auto: getUpgradeCost('auto'),
  };

  return (
    <div className="h-full bg-black text-white selection:bg-cyan-500/30 overflow-hidden">
      {gameState === 'ARENA' && (
        <div className="h-full flex flex-col">
          <Shop 
            money={money} 
            wins={wins} 
            isHM={isHM} 
            autoLvl={autoLvl} 
            costs={currentCosts}
            onBuy={handleBuy} 
          />
          <Arena 
            money={money} 
            wins={wins} 
            power={power} 
            hp={hp} 
            maxHP={maxHP} 
            isHM={isHM} 
            onHit={handleHit}
            onToggleHM={() => setIsHM(!isHM)}
          />
        </div>
      )}

      {gameState === 'CHASE' && (
        <ChaseUI 
          mode={chaseMode} 
          onWin={handleChaseWin} 
          onDie={handleDie} 
        />
      )}

      {gameState === 'DEATH' && (
        <DeathScreen 
          message={deathMessage} 
          money={money} 
          onRevive={handleRevive} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}
