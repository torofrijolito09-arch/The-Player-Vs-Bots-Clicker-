/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Flame, Wind } from 'lucide-react';
import { ChaseMode } from '../types';

interface ChaseUIProps {
  mode: ChaseMode;
  onWin: () => void;
  onDie: (msg: string) => void;
}

export default function ChaseUI({ mode, onWin, onDie }: ChaseUIProps) {
  const [distance, setDistance] = useState(0);
  const [pY, setPY] = useState(100);
  const [pLeft, setPLeft] = useState(200);
  const [kLeft, setKLeft] = useState(-300);
  const [isMoving, setIsMoving] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [obstacles, setObstacles] = useState<{ id: number; left: number }[]>([]);
  const [boltActive, setBoltActive] = useState(false);
  const [boltX, setBoltX] = useState(0);

  const goal = mode === 'LIGHT' ? 3000 : 4000;
  const velY = useRef(0);
  const frameRef = useRef(0);
  const timerRef = useRef(0);
  const nextObsDist = useRef(350);

  // Jump logic
  const jump = () => {
    if (isGrounded) {
      velY.current = 22;
      setIsGrounded(false);
    }
  };

  useEffect(() => {
    const loop = () => {
      timerRef.current++;
      
      // Physics
      setPY(prev => {
        const nextY = prev + velY.current;
        if (nextY > 100) {
          velY.current -= 1.6;
          return nextY;
        } else {
          velY.current = 0;
          setIsGrounded(true);
          return 100;
        }
      });

      let killerSpeed = 2.4;
      let moveSpeed = 3.2;

      // Rage logic (Every 500 frames)
      const rageCycle = timerRef.current % 500;
      if (rageCycle > 350) {
        killerSpeed = 7.5;
        moveSpeed = 7.5;
        if (rageCycle === 351) spawnObstacle();
      }

      // Movement & Distance
      if (isMoving) {
        setDistance(prev => {
          const next = prev + (moveSpeed / 2.5);
          if (next >= goal) onWin();
          
          // Obstacle spawning
          if (next > nextObsDist.current) {
            spawnObstacle();
            nextObsDist.current += 350;
          }
          return next;
        });
        setKLeft(prev => prev - (moveSpeed - killerSpeed));
      } else {
        setKLeft(prev => prev + killerSpeed);
      }

      // Light Bolt mechanic
      if (mode === 'LIGHT' && timerRef.current % 666 === 0) {
        setBoltActive(true);
        setBoltX(kLeft + 100);
      }

      // Update bolt position
      if (boltActive) {
        setBoltX(prev => {
          const next = prev + 18;
          if (next > 1200) setBoltActive(false);
          // Collision
          if (next > pLeft && next < pLeft + 45 && pY < 135) onDie("TERMINATED BY LIGHT");
          return next;
        });
      }

      // Update Obstacles
      setObstacles(prev => prev.map(o => ({
        ...o,
        left: isMoving ? o.left - 15 : o.left
      })).filter(o => o.left > -200));

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isMoving, pY, pLeft, kLeft, boltActive, mode]);

  // Collision Detection
  useEffect(() => {
    const hitBox = mode === 'FIRE' ? kLeft + 240 : kLeft + 130;
    if (hitBox > pLeft) onDie(mode === 'FIRE' ? "INCINERATED" : "CONSUMED");

    obstacles.forEach(o => {
      if (o.left > pLeft - 10 && o.left < pLeft + 45 && pY < 155) {
        if (mode === 'FIRE') onDie("INCINERATED BY OBSTACLE");
        else setPLeft(prev => Math.max(0, prev - 12));
      } else if (pLeft < 200) {
        setPLeft(prev => Math.min(200, prev + 1.5));
      }
    });
  }, [kLeft, obstacles, pLeft, pY, mode]);

  const spawnObstacle = () => {
    setObstacles(prev => [...prev, { id: Date.now(), left: 1200 }]);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none touch-none">
      {/* Progress */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] max-w-md h-6 bg-white/10 border-2 border-white rounded-full overflow-hidden z-50">
        <motion.div 
          className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${(distance / goal) * 100}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-widest">
          {Math.floor(distance)}m / {goal}m
        </div>
      </div>

      {/* Ground */}
      <div 
        className="absolute bottom-0 h-24 bg-neutral-900 border-t-4 border-white"
        style={{ width: '20000px', left: `-${(distance * 10) % 1000}px` }}
      />

      {/* Killer */}
      <div 
        className={`absolute bottom-0 z-40 transition-all ${
          mode === 'FIRE' 
            ? 'h-full w-[280px] bg-gradient-to-t from-red-600 via-orange-500 to-transparent shadow-[0_0_80px_rgba(239,68,68,0.8)] animate-pulse'
            : 'h-[150px] w-[150px] bg-white border-2 border-white shadow-[0_0_100px_white]'
        }`}
        style={{ left: `${kLeft}px`, bottom: mode === 'FIRE' ? '0' : '100px' }}
      >
        {mode === 'FIRE' ? (
          <div className="absolute inset-0 bg-red-600/20 animate-pulse" />
        ) : (
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Player */}
      <div 
        className="absolute w-[45px] h-[45px] bg-cyan-400 border-2 border-white z-40 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
        style={{ left: `${pLeft}px`, bottom: `${pY}px` }}
      />

      {/* Obstacles */}
      {obstacles.map(o => (
        <div 
          key={o.id}
          className="absolute bottom-[100px] w-[55px] h-[55px] bg-white border-4 border-red-600 z-30"
          style={{ left: `${o.left}px` }}
        />
      ))}

      {/* Bolt */}
      {boltActive && (
        <div 
          className="absolute bottom-[125px] w-[45px] h-[15px] bg-yellow-400 shadow-[0_0_30px_#facc15] rounded-full z-50"
          style={{ left: `${boltX}px` }}
        />
      )}

      {/* Constraints for mobile/desktop */}
      <div className="absolute bottom-10 right-10 flex gap-6 z-50">
        <button 
          onMouseDown={jump}
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
          className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white text-white font-black text-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-transform"
        >
          JUMP
        </button>
        <button 
          onMouseDown={() => setIsMoving(true)}
          onMouseUp={() => setIsMoving(false)}
          onTouchStart={(e) => { e.preventDefault(); setIsMoving(true); }}
          onTouchEnd={(e) => { e.preventDefault(); setIsMoving(false); }}
          className={`w-24 h-24 rounded-3xl backdrop-blur-md border-2 text-white font-black text-xl flex items-center justify-center transition-all ${
            isMoving ? 'bg-green-500/40 border-green-400 scale-95' : 'bg-white/10 border-white'
          }`}
        >
          RUN
        </button>
      </div>

      {/* Visual Effects */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-noise opacity-5" />
        {mode === 'FIRE' && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-transparent" />
        )}
      </div>
    </div>
  );
}
