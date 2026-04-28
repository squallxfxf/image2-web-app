const blockedKeywords = [
  '未成年人色情',
  '成人',
  '血腥',
  '暴力',
  '毒品',
  '政治谣言',
  'deepfake',
  'celebrity nude'
];

export function moderatePrompt(prompt: string): { blocked: boolean; reason?: string } {
  const hit = blockedKeywords.find((k) => prompt.toLowerCase().includes(k.toLowerCase()));
  return hit ? { blocked: true, reason: `命中高风险关键词: ${hit}` } : { blocked: false };
}
