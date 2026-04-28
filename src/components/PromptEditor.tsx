'use client';

import { useState } from 'react';
import type { PromptTargetType } from '@/types/domain';
import { PromptOptimizeDialog } from './PromptOptimizeDialog';
import { PromptVersionHistory } from './PromptVersionHistory';

export function PromptEditor({
  generatedImageId,
  field,
  targetType,
  value,
  onSaved
}: {
  generatedImageId: string;
  field: 'imageDescription' | 'image2Prompt' | 'ltxPrompt' | 'wanPrompt';
  targetType: PromptTargetType;
  value: string;
  onSaved: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const [showOpt, setShowOpt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const save = async () => {
    const res = await fetch(`/api/images/${generatedImageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: text })
    });
    if (res.ok) {
      setEditing(false);
      onSaved(text);
    }
  };

  const loadHistory = async () => {
    const res = await fetch(`/api/images/${generatedImageId}/versions?type=${targetType}`);
    const data = await res.json();
    if (res.ok) {
      setHistory(data.items ?? []);
      setShowHistory(true);
    }
  };

  return (
    <div className="space-y-2">
      {editing ? <textarea className="w-full rounded border p-2" value={text} onChange={(e: any) => setText((e.target as HTMLTextAreaElement).value)} /> : <p className="whitespace-pre-wrap text-sm">{text}</p>}
      <div className="flex flex-wrap gap-2 text-xs">
        <button onClick={() => navigator.clipboard.writeText(text)} className="rounded border px-2 py-1">复制</button>
        <button onClick={() => setEditing((v: any) => !v)} className="rounded border px-2 py-1">编辑</button>
        <button onClick={save} className="rounded border px-2 py-1">保存</button>
        <button onClick={() => setShowOpt((v: any) => !v)} className="rounded border px-2 py-1">AI优化</button>
        <button onClick={loadHistory} className="rounded border px-2 py-1">历史版本</button>
      </div>
      {showOpt && <PromptOptimizeDialog generatedImageId={generatedImageId} targetType={targetType} currentContent={text} onDone={(v) => { setText(v); onSaved(v); setShowOpt(false); }} />}
      {showHistory && <PromptVersionHistory items={history} onUse={(content) => setText(content)} />}
    </div>
  );
}
