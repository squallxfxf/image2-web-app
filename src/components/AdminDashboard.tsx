import { prisma } from '@/lib/prisma';

export async function AdminDashboard() {
  const [users, jobs, images, txs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.generationJob.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.generatedImage.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.creditTransaction.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded border bg-white p-4"><h2 className="font-semibold">用户</h2><pre>{JSON.stringify(users, null, 2)}</pre></section>
      <section className="rounded border bg-white p-4"><h2 className="font-semibold">任务</h2><pre>{JSON.stringify(jobs, null, 2)}</pre></section>
      <section className="rounded border bg-white p-4"><h2 className="font-semibold">图片</h2><pre>{JSON.stringify(images, null, 2)}</pre></section>
      <section className="rounded border bg-white p-4"><h2 className="font-semibold">积分流水</h2><pre>{JSON.stringify(txs, null, 2)}</pre></section>
    </div>
  );
}
