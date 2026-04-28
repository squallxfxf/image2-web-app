'use client';

import { useEffect, useState } from 'react';
import { PromptInputPanel } from './PromptInputPanel';
import { GeneratedImageList } from './GeneratedImageList';
import { CreditBalance } from './CreditBalance';

export function ImageStudioPage() {
  const [images, setImages] = useState([]);
  const [jobId, setJobId] = useState(null);

  const refresh = async () => {
    const res = await fetch('/api/images?page=1&pageSize=30');
    if (res.ok) {
      const data = await res.json();
      setImages(data.items ?? []);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!jobId) return;
    const timer = setInterval(async () => {
      const r = await fetch(`/api/jobs/${jobId}`);
      if (!r.ok) return;
      const data = await r.json();
      if (['completed', 'failed', 'refunded'].includes(data.status)) {
        clearInterval(timer);
        refresh();
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [jobId]);

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Image Studio</h1>
        <CreditBalance />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1"><PromptInputPanel onCreated={setJobId} /></div>
        <div className="lg:col-span-2"><GeneratedImageList images={images} refresh={refresh} /></div>
      </div>
    </main>
  );
}
