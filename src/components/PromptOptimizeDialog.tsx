'use client';

import { useState } from 'react';
import type { PromptTargetType } from '@/types/domain';

export function PromptOptimizeDialog({
  generatedImageId,
  targetType,
  currentContent,
  onDone
}: {
  generatedImageId: string;
  targetType: PromptTargetType;
  currentContent: string;
  onDone: (content: string) => void;
}) {
  const [instruction, setInstruction] = useState('');

  const optimize = async () => {
    const res = await fetch('/api/prompt/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatedImageId, targetType, userInstruction: instruction, currentContent })
    });
    const data = await res.json();
    if (res.ok) onDone(data.content);
    else alert(data.error ?? '优化失败');
  };

  return (
    <div className="rounded border p-3">
      <p className="mb-2 text-sm">当前内容</p>
      <p className="mb-2 max-h-32 overflow-y-auto whitespace-pre-wrap rounded bg-slate-100 p-2 text-sm">{currentContent}</p>
      <textarea className="w-full rounded border p-2" value={instruction} onChange={(e: any) => setInstruction((e.target as HTMLTextAreaElement).value)} placeholder="输入补充要求" />
      <button className="mt-2 rounded bg-black px-3 py-1 text-white" onClick={optimize}>生成新版本</button>
    </div>
  );
}
