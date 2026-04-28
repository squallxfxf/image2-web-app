const qualityMultiplier: Record<string, number> = {
  low: 1,
  medium: 1.5,
  high: 2,
  auto: 1.6
};

const aspectMultiplier: Record<string, number> = {
  '1:1': 1,
  '9:16': 1.2,
  '16:9': 1.2,
  '4:3': 1.1,
  '3:4': 1.1
};

export function calcCreditCost(count: number, quality: string, aspectRatio: string): number {
  const base = 10;
  const q = qualityMultiplier[quality] ?? 1.5;
  const a = aspectMultiplier[aspectRatio] ?? 1;
  return Math.ceil(base * q * a * count);
}
