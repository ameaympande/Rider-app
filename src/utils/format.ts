export function formatSpeed(speedKmh: number): string {
  return `${Math.max(0, Math.round(speedKmh))}`;
}

export function formatBattery(level: number): string {
  return `${Math.max(0, Math.min(100, Math.round(level)))}%`;
}
