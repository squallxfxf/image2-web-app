'use client';

import { useState } from 'react';

export function PromptInputPanel({ onCreated }: { onCreated: (jobId: string) => void }) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [count, setCount] = useState(1);
  const [quality, setQuality] = useState('medium');
  const [outputFormat, setOutputFormat] = useState('png');

  const submit = async () => {
    const res = await fetch('/api/generate/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, negativePrompt, style, aspectRatio, count, quality, outputFormat })
    });
    const data = await res.json();
    if (res.ok) onCreated(data.jobId);
    else alert(data.error ?? '提交失败');
  };

  return (
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <textarea value={prompt} onChange={(e: any) => setPrompt((e.target as HTMLTextAreaElement).value)} className="w-full rounded border p-2" placeholder="主提示词" />
      <textarea value={negativePrompt} onChange={(e: any) => setNegativePrompt((e.target as HTMLTextAreaElement).value)} className="w-full rounded border p-2" placeholder="负面提示词" />
      <input value={style} onChange={(e: any) => setStyle((e.target as HTMLInputElement).value)} className="w-full rounded border p-2" placeholder="风格" />
      <div className="grid grid-cols-2 gap-2">
        <select value={aspectRatio} onChange={(e: any) => setAspectRatio((e.target as HTMLSelectElement).value)} className="rounded border p-2">
          {['1:1', '9:16', '16:9', '4:3', '3:4'].map((a) => <option key={a}>{a}</option>)}
        </select>
        <input type="number" min={1} max={4} value={count} onChange={(e: any) => setCount(Number((e.target as HTMLInputElement).value))} className="rounded border p-2" />
        <select value={quality} onChange={(e: any) => setQuality((e.target as HTMLSelectElement).value)} className="rounded border p-2">
          {['low', 'medium', 'high', 'auto'].map((a) => <option key={a}>{a}</option>)}
        </select>
        <select value={outputFormat} onChange={(e: any) => setOutputFormat((e.target as HTMLSelectElement).value)} className="rounded border p-2">
          {['png', 'jpeg', 'webp'].map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <button onClick={submit} className="w-full rounded bg-black py-2 text-white">生成</button>
    </div>
  );
}
