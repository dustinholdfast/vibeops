/**
 * Lightweight pure tests for deadline & health logic.
 * Run with: npx vitest run src/lib/deadline.test.ts
 * (or any test runner that supports TypeScript)
 */

import { getDeadlineState, toLocalDateString, parseLocalDate } from './utils';
import type { Stage } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const today = toLocalDateString();
const yesterday = toLocalDateString(new Date(Date.now() - 86400000));
const tomorrow = toLocalDateString(new Date(Date.now() + 86400000));
const inFiveDays = toLocalDateString(new Date(Date.now() + 5 * 86400000));
const inTenDays = toLocalDateString(new Date(Date.now() + 10 * 86400000));

// No target
assert(getDeadlineState(null, 'Exploring') === 'none', 'null target → none');
assert(getDeadlineState(null, 'Building') === 'none', 'null target on Building → none');

// Inactive stages ignore target
assert(getDeadlineState(yesterday, 'Live') === 'inactive', 'Live → inactive');
assert(getDeadlineState(yesterday, 'Paused') === 'inactive', 'Paused → inactive');
assert(getDeadlineState(yesterday, 'Archived') === 'inactive', 'Archived → inactive');

// Overdue
assert(getDeadlineState(yesterday, 'Testing') === 'overdue', 'yesterday → overdue');

// Due today
assert(getDeadlineState(today, 'Exploring') === 'due-today', 'today → due-today');

// Due soon (≤ 7 days)
assert(getDeadlineState(tomorrow, 'Building') === 'due-soon', 'tomorrow → due-soon');
assert(getDeadlineState(inFiveDays, 'Testing') === 'due-soon', '5 days → due-soon');

// Future
assert(getDeadlineState(inTenDays, 'Exploring') === 'future', '10 days → future');

// Invalid / missing health fallback is handled at UI layer (defaults to On track on migrate)

console.log('All deadline tests passed.');
