import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-10">
      <h1 className="text-3xl font-bold">Image Studio MVP</h1>
      <p className="mt-3 text-slate-600">商业化 AI 图片与提示词管理平台</p>
      <div className="mt-6 flex gap-3">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/studio">进入工作台</Link>
        <Link className="rounded border px-4 py-2" href="/admin">管理后台</Link>
      </div>
    </main>
  );
}
