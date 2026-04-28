import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return Response.json({ credits: 0 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return Response.json({ credits: user?.credits ?? 0 });
}
