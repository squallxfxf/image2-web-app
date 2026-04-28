'use client';

export function ImagePreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <img src={url} className="max-h-[90vh] max-w-[90vw] rounded" />
    </div>
  );
}
