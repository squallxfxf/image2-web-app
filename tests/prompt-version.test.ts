import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { promptFieldMap } from '../src/lib/prompt-version';

describe('promptFieldMap', () => {
  it('maps prompt fields to prompt types', () => {
    assert.equal(promptFieldMap.imageDescription, 'image_description');
    assert.equal(promptFieldMap.image2Prompt, 'image2_prompt');
    assert.equal(promptFieldMap.ltxPrompt, 'ltx_prompt');
    assert.equal(promptFieldMap.wanPrompt, 'wan_prompt');
  });
});
