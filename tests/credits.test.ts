import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calcCreditCost } from '../src/lib/credits.ts';

describe('calcCreditCost', () => {
  it('returns higher cost for high quality', () => {
    assert.ok(calcCreditCost(1, 'high', '1:1') > calcCreditCost(1, 'low', '1:1'));
  });

  it('scales with count', () => {
    assert.equal(calcCreditCost(2, 'medium', '1:1'), calcCreditCost(1, 'medium', '1:1') * 2);
  });
});
