export function withMinimumDelay<T>(
  promise: Promise<T>,
  minMs: number = 1200,
): Promise<T> {
  const delay = new Promise<void>((resolve) => setTimeout(resolve, minMs));
  return Promise.all([promise, delay]).then(([result]) => result);
}
