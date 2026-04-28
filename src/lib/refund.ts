export function shouldRefundJob(input: { status: string; hasRefundTransaction: boolean }) {
  if (input.status === 'refunded') return false;
  if (input.hasRefundTransaction) return false;
  return true;
}
