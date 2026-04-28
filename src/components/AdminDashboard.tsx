import { prisma } from '@/lib/prisma';

export async function AdminDashboard() {
  const [users, jobs, images, txs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, email: true, role: true, credits: true, createdAt: true } }),
    prisma.generationJob.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, status: true, creditCost: true, errorMessage: true, createdAt: true } }),
    prisma.generatedImage.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, imageUrl: true, image2Prompt: true, ltxPrompt: true, wanPrompt: true } }),
    prisma.creditTransaction.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, type: true, amount: true, reason: true, relatedJobId: true } })
  ]);

  const totalCreditsConsumed = jobs.reduce((sum: any, j: any) => sum + j.creditCost, 0);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded border bg-white p-3 text-sm">用户数：<b>{users.length}</b></div>
        <div className="rounded border bg-white p-3 text-sm">近10任务消耗积分：<b>{totalCreditsConsumed}</b></div>
        <div className="rounded border bg-white p-3 text-sm">近10图片：<b>{images.length}</b></div>
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">用户</h2>
        {users.map((u: any) => <div key={u.id} className="border-b py-1 text-xs">{u.email} | {u.role} | credits:{u.credits}</div>)}
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">任务</h2>
        {jobs.map((j: any) => <div key={j.id} className="border-b py-1 text-xs">{j.id} | {j.status} | cost:{j.creditCost} | err:{j.errorMessage ?? '-'}</div>)}
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">图片与提示词绑定</h2>
        {images.map((i: any) => <div key={i.id} className="border-b py-1 text-xs">{i.id} | {i.imageUrl} | IMAGE2:{i.image2Prompt.slice(0, 30)}...</div>)}
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">积分流水</h2>
        {txs.map((t: any) => <div key={t.id} className="border-b py-1 text-xs">{t.type} | {t.amount} | {t.reason} | job:{t.relatedJobId ?? '-'}</div>)}
      </section>
    </div>
  );
}
