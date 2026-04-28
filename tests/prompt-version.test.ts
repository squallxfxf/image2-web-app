import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PROMPT_FIELD_MAP, PROMPT_TARGET_TYPES } from '../src/lib/constants.ts';

describe('prompt field constants', () => {
  it('maps prompt fields to prompt types', () => {
    assert.equal(PROMPT_FIELD_MAP.imageDescription, 'image_description');
    assert.equal(PROMPT_FIELD_MAP.image2Prompt, 'image2_prompt');
    assert.equal(PROMPT_FIELD_MAP.ltxPrompt, 'ltx_prompt');
    assert.equal(PROMPT_FIELD_MAP.wanPrompt, 'wan_prompt');
  });

  it('target types are unique and complete', () => {
    const set = new Set(PROMPT_TARGET_TYPES);
    assert.equal(set.size, 4);
    assert.ok(set.has('image_description'));
    assert.ok(set.has('image2_prompt'));
    assert.ok(set.has('ltx_prompt'));
    assert.ok(set.has('wan_prompt'));
  });
});
