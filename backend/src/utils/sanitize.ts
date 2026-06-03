function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .trim()
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "");
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, sanitizeValue(val)])
    );
  }
  return value;
}

export function sanitizePayload<T>(payload: T): T {
  return sanitizeValue(payload) as T;
}

