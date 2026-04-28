'use client';

import { useEffect, useState } from 'react';

export function CreditBalance() {
  const [credits, setCredits] = useState(0);
  const [amount, setAmount] = useState(20);

  const load = async () => {
    const res = await fetch('/api/me');
    if (res.ok) {
      const data = await res.json();
      setCredits(data.credits ?? 0);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const checkout = async () => {
    const res = await fetch('/api/billing/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (res.ok && data.url) window.location.href = data.url;
    else alert(data.error ?? '充值会话创建失败');
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
      <span>积分余额：<b>{credits}</b></span>
      <input className="w-16 rounded border px-1 py-0.5" type="number" value={amount} onChange={(e: any) => setAmount(Number((e.target as HTMLInputElement).value))} />
      <button className="rounded border px-2 py-1 text-xs" onClick={checkout}>Stripe 充值(预留)</button>
    </div>
  );
}
