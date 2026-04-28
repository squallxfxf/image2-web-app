'use client';

import { useState } from 'react';
import type { GeneratedImageCardModel } from '@/types/domain';
import { PromptTabs } from './PromptTabs';
import { ImagePreviewModal } from './ImagePreviewModal';

export function GeneratedImageCard({ image, refresh }: { image: GeneratedImageCardModel; refresh: () => void }) {
  const [preview, setPreview] = useState(false);

  const toggleFavorite = async () => {
    await fetch(`/api/images/${image.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: !image.isFavorite })
    });
    refresh();
  };

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <img src={image.imageUrl} className="h-52 w-full cursor-pointer rounded object-cover" onClick={() => setPreview(true)} />
      <div className="mt-2 flex gap-2 text-xs">
        <a href={image.imageUrl} download className="rounded border px-2 py-1">下载</a>
        <button onClick={() => navigator.clipboard.writeText(image.imageUrl)} className="rounded border px-2 py-1">复制链接</button>
        <button onClick={toggleFavorite} className="rounded border px-2 py-1">{image.isFavorite ? '取消收藏' : '收藏'}</button>
      </div>
      <div className="mt-3">
        <PromptTabs image={image} onChanged={refresh} />
      </div>
      {preview && <ImagePreviewModal url={image.imageUrl} onClose={() => setPreview(false)} />}
    </div>
  );
}
