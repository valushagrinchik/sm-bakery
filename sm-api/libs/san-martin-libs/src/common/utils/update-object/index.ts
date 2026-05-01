export function updateObject<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  for (const key in source) {
    if (source[key] !== null && source[key] !== undefined) {
      target[key] = source[key];
    }
  }
  return target;
}
