'use client';

import { useEffect, useState } from 'react';

export function CreditBalance() {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetch('/api/me').then(async (r) => setCredits((await r.json()).credits ?? 0)).catch(() => setCredits(0));
  }, []);

  return <div className="rounded-lg border bg-white px-4 py-2 text-sm">积分余额：<b>{credits}</b></div>;
}
