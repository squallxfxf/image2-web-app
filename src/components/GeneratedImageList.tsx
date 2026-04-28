'use client';

import { GeneratedImageCard } from './GeneratedImageCard';

export function GeneratedImageList({ images, refresh }: { images: any[]; refresh: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {images.map((img) => <GeneratedImageCard key={img.id} image={img} refresh={refresh} />)}
    </div>
  );
}
