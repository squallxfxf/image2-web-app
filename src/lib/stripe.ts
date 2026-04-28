export async function createStripeCheckoutSession(input: { userId: string; amount: number; successUrl: string; cancelUrl: string }) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY 未配置');

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', input.successUrl);
  params.set('cancel_url', input.cancelUrl);
  params.set('line_items[0][price_data][currency]', 'usd');
  params.set('line_items[0][price_data][product_data][name]', `Image Studio Credits (${input.amount})`);
  params.set('line_items[0][price_data][unit_amount]', String(input.amount * 100));
  params.set('line_items[0][quantity]', '1');
  params.set('metadata[userId]', input.userId);

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe 创建失败: ${text}`);
  }

  return response.json() as Promise<{ id: string; url: string }>;
}
