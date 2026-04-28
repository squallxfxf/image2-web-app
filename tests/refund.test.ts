import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { shouldRefundJob } from '../src/lib/refund.ts';

describe('shouldRefundJob', () => {
  it('returns false when already refunded', () => {
    assert.equal(shouldRefundJob({ status: 'refunded', hasRefundTransaction: false }), false);
  });

  it('returns false when refund transaction already exists', () => {
    assert.equal(shouldRefundJob({ status: 'failed', hasRefundTransaction: true }), false);
  });

  it('returns true for first failure without refund', () => {
    assert.equal(shouldRefundJob({ status: 'processing', hasRefundTransaction: false }), true);
  });
});
