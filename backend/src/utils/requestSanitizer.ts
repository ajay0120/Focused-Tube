export const getTrimmedString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const getNormalizedEmail = (value: unknown): string | null => {
  const email = getTrimmedString(value);
  return email ? email.toLowerCase() : null;
};

export const getOptionalTrimmedString = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return getTrimmedString(value) ?? undefined;
};

export const getStringArray = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const sanitized = value
    .map((item) => (typeof item === 'string' ? item.trim() : null))
    .filter((item): item is string => Boolean(item));

  return sanitized;
};

export const getOptionalNumber = (value: unknown): number | undefined | null => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null;
  }

  return value;
};

export const getOptionalBoolean = (value: unknown): boolean | undefined | null => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'boolean') {
    return null;
  }

  return value;
};
