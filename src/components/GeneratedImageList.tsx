'use client';

import type { GeneratedImageCardModel } from '@/types/domain';
import { GeneratedImageCard } from './GeneratedImageCard';

export function GeneratedImageList({ images, refresh }: { images: GeneratedImageCardModel[]; refresh: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {images.map((img) => <GeneratedImageCard image={img} refresh={refresh} />)}
    </div>
  );
}
