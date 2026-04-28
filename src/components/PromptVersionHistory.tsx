'use client';

export function PromptVersionHistory({ items }: { items: Array<{ versionNumber: number; content: string; createdAt: string }> }) {
  return (
    <div className="space-y-2 text-sm">
      {items.map((v) => (
        <div key={v.versionNumber} className="rounded border p-2">
          <div className="font-medium">版本 {v.versionNumber}</div>
          <div className="text-slate-600">{new Date(v.createdAt).toLocaleString()}</div>
          <p className="mt-1 whitespace-pre-wrap">{v.content}</p>
        </div>
      ))}
    </div>
  );
}
