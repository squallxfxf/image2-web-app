'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GeneratedImageCardModel, ImageListResponse } from '@/types/domain';
import { PromptInputPanel } from './PromptInputPanel';
import { GeneratedImageList } from './GeneratedImageList';
import { CreditBalance } from './CreditBalance';

export function ImageStudioPage() {
  const [images, setImages] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState('idle');
  const [query, setQuery] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const loadUrl = useMemo(() => {
    const params = new URLSearchParams({ page: '1', pageSize: '30' });
    if (query.trim()) params.set('q', query.trim());
    if (favoriteOnly) params.set('favorite', 'true');
    return `/api/images?${params.toString()}`;
  }, [query, favoriteOnly]);

  const refresh = async () => {
    const res = await fetch(loadUrl);
    if (res.ok) {
      const data = (await res.json()) as ImageListResponse;
      setImages(data.items ?? []);
    }
  };

  useEffect(() => {
    refresh();
  }, [loadUrl]);

  useEffect(() => {
    if (!jobId) return;
    const stream = new EventSource(`/api/jobs/${jobId}/stream`);
    stream.onmessage = (event) => {
      const payload = JSON.parse(event.data) as { status: string };
      setJobStatus(payload.status);
      if (['completed', 'failed', 'refunded'].includes(payload.status)) {
        stream.close();
        refresh();
      }
    };
    stream.onerror = () => stream.close();
    return () => stream.close();
  }, [jobId]);

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Image Studio</h1>
        <CreditBalance />
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded border bg-white p-3 text-sm">
        <input value={query} onChange={(e: any) => setQuery((e.target as HTMLInputElement).value)} placeholder="搜索提示词" className="rounded border px-2 py-1" />
        <label className="flex items-center gap-1"><input type="checkbox" checked={favoriteOnly} onChange={(e: any) => setFavoriteOnly((e.target as HTMLInputElement).checked)} />仅看收藏</label>
        <button onClick={refresh} className="rounded border px-2 py-1">刷新</button>
        <span className="text-slate-500">任务状态：{jobStatus}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1"><PromptInputPanel onCreated={setJobId} /></div>
        <div className="lg:col-span-2"><GeneratedImageList images={images} refresh={refresh} /></div>
      </div>
    </main>
  );
}
