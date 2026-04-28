import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let count = 0;
      const timer = setInterval(async () => {
        const job = await prisma.generationJob.findFirst({ where: { id: params.id, userId }, select: { status: true } });
        if (!job) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ status: 'not_found' })}\n\n`));
          clearInterval(timer);
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: job.status })}\n\n`));
        count += 1;
        if (['completed', 'failed', 'refunded'].includes(job.status) || count > 120) {
          clearInterval(timer);
          controller.close();
        }
      }, 2000);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
