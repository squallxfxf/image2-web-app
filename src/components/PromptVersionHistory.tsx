'use client';

export function PromptVersionHistory({
  items,
  onUse
}: {
  items: Array<{ id: string; versionNumber: number; content: string; createdAt: string }>;
  onUse: (content: string) => void;
}) {
  return (
    <div className="space-y-2 text-sm">
      {items.map((v) => (
        <div key={v.id} className="rounded border p-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">版本 {v.versionNumber}</div>
            <button className="rounded border px-2 py-0.5 text-xs" onClick={() => onUse(v.content)}>使用此版本</button>
          </div>
          <div className="text-slate-600">{new Date(v.createdAt).toLocaleString()}</div>
          <p className="mt-1 whitespace-pre-wrap">{v.content}</p>
        </div>
      ))}
    </div>
  );
}
