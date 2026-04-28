import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PROMPT_FIELD_MAP } from '../src/lib/constants.ts';

describe('promptFieldMap', () => {
  it('maps prompt fields to prompt types', () => {
    assert.equal(PROMPT_FIELD_MAP.imageDescription, 'image_description');
    assert.equal(PROMPT_FIELD_MAP.image2Prompt, 'image2_prompt');
    assert.equal(PROMPT_FIELD_MAP.ltxPrompt, 'ltx_prompt');
    assert.equal(PROMPT_FIELD_MAP.wanPrompt, 'wan_prompt');
  });
});
