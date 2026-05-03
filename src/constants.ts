/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Upgrade } from './types';

export const UPGRADES: Upgrade[] = [
  { id: 'tool', name: 'Tools', baseCost: 10, powerGain: 1, description: '+1 Power' },
  { id: 'hacker', name: 'Hacker', baseCost: 100, powerGain: 5, description: '+5 Power' },
  { id: 'turret', name: 'Turret', baseCost: 500, powerGain: 25, description: '+25 Power', requiresWins: 25 },
  { id: 'ship', name: 'Ship', baseCost: 10000, powerGain: 200, description: '+200 Power' },
];

export const AUTO_BOT_COST = 1000;
export const AUTO_BOT_INTERVALS = [0, 2000, 1000, 300];
export const REVIVE_COST = 5000;
export const HARD_MODE_COST_MULT = 1.3;
export const HARD_MODE_POWER_MULT = 0.5;
