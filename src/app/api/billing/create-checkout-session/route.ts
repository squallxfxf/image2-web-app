import { z } from 'zod';
import { auth } from '@/lib/auth';
import { AppError, apiErrorResponse } from '@/lib/errors';
import { createStripeCheckoutSession } from '@/lib/stripe';

const schema = z.object({ amount: z.number().int().min(5).max(5000) });

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const { amount } = schema.parse(await req.json());
    const origin = new URL(req.url).origin;
    const checkout = await createStripeCheckoutSession({
      userId,
      amount,
      successUrl: `${origin}/studio?payment=success`,
      cancelUrl: `${origin}/studio?payment=cancel`
    });

    return Response.json({ id: checkout.id, url: checkout.url });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
