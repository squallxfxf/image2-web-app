'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('User123456!');

  return (
    <main className="mx-auto mt-16 max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">登录</h1>
      <input value={email} onChange={(e: any) => setEmail(e.target.value)} className="mb-2 w-full rounded border p-2" />
      <input value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" className="mb-2 w-full rounded border p-2" />
      <button className="w-full rounded bg-black py-2 text-white" onClick={() => signIn('credentials', { email, password, callbackUrl: '/studio' })}>登录</button>
    </main>
  );
}
