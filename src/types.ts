/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'ARENA' | 'CHASE' | 'DEATH';
export type ChaseMode = 'LIGHT' | 'FIRE';

export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  powerGain: number;
  description: string;
  requiresWins?: number;
}

export interface GameStateProps {
  money: number;
  wins: number;
  power: number;
  hp: number;
  maxHP: number;
  autoLvl: number;
  upgradeLevels: Record<string, number>;
  isHM: boolean;
  gameState: GameState;
  chaseMode: ChaseMode;
  deathMessage: string;
}
