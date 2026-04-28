'use client';

import { useState } from 'react';
import { PromptEditor } from './PromptEditor';

export function PromptTabs({ image, onChanged }: { image: any; onChanged: () => void }) {
  const [tab, setTab] = useState<'desc' | 'image2' | 'ltx' | 'wan'>('desc');

  const config = {
    desc: { label: '图片描述', field: 'imageDescription', targetType: 'image_description', value: image.imageDescription ?? '' },
    image2: { label: 'IMAGE2', field: 'image2Prompt', targetType: 'image2_prompt', value: image.image2Prompt ?? '' },
    ltx: { label: 'LTX2.3', field: 'ltxPrompt', targetType: 'ltx_prompt', value: image.ltxPrompt ?? '' },
    wan: { label: 'WAN2.2', field: 'wanPrompt', targetType: 'wan_prompt', value: image.wanPrompt ?? '' }
  } as const;

  const current = config[tab];

  return (
    <div>
      <div className="mb-2 flex gap-2 text-xs">
        {Object.entries(config).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`rounded px-2 py-1 ${tab === k ? 'bg-black text-white' : 'border'}`}>{v.label}</button>
        ))}
      </div>
      <PromptEditor generatedImageId={image.id} field={current.field as any} targetType={current.targetType as any} value={current.value} onSaved={onChanged} />
    </div>
  );
}
