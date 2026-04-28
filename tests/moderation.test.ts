import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { moderatePrompt } from '../src/lib/moderation';

describe('moderatePrompt', () => {
  it('blocks risky content', () => {
    const res = moderatePrompt('请生成包含血腥暴力场景');
    assert.equal(res.blocked, true);
  });

  it('allows normal content', () => {
    const res = moderatePrompt('城市街拍，写实风');
    assert.equal(res.blocked, false);
  });
});
