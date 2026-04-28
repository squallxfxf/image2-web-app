'use client';

import { useMemo, useState } from 'react';
import { PromptEditor } from './PromptEditor';

type TabKey = 'desc' | 'image2' | 'ltx' | 'wan';

export function PromptTabs({ image, onChanged }: { image: any; onChanged: () => void }) {
  const [tab, setTab] = useState<TabKey>('desc');

  const config = useMemo(
    () => ({
      desc: { label: '图片描述', field: 'imageDescription', targetType: 'image_description', value: image.imageDescription ?? '' },
      image2: { label: 'IMAGE2', field: 'image2Prompt', targetType: 'image2_prompt', value: image.image2Prompt ?? '' },
      ltx: { label: 'LTX2.3', field: 'ltxPrompt', targetType: 'ltx_prompt', value: image.ltxPrompt ?? '' },
      wan: { label: 'WAN2.2', field: 'wanPrompt', targetType: 'wan_prompt', value: image.wanPrompt ?? '' }
    }),
    [image]
  );

  const current = config[tab];

  return (
    <div>
      <div className="mb-2 flex gap-2 text-xs">
        {(Object.keys(config) as TabKey[]).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded px-2 py-1 ${tab === k ? 'bg-black text-white' : 'border'}`}>
            {config[k].label}
          </button>
        ))}
      </div>
      <PromptEditor generatedImageId={image.id} field={current.field as any} targetType={current.targetType as any} value={current.value} onSaved={onChanged} />
    </div>
  );
}
