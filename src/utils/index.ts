export interface ChangedFields {
  previous: Record<string, any>;
  current: Record<string, any>;
}

export function generateChangedFields(
  previousObj: Record<string, any>,
  currentObj: Record<string, any>,
  omitFields: string[] = [],
): ChangedFields {
  const changedFields: ChangedFields = { previous: {}, current: {} };

  for (const key in previousObj) {
    if (previousObj.hasOwnProperty(key) && currentObj.hasOwnProperty(key)) {
      if (omitFields.includes(key)) {
        continue; // Skip the omitted fields
      }
      const prevValue = previousObj[key];
      const currValue = currentObj[key];

      // Check if the values are dates and compare them as date objects
      if (isDate(prevValue) && isDate(currValue)) {
        const prevDate = new Date(prevValue).toISOString();
        const currDate = new Date(currValue).toISOString();
        if (prevDate !== currDate) {
          changedFields.previous[key] = prevValue;
          changedFields.current[key] = currValue;
        }
      } else if (prevValue !== currValue) {
        changedFields.previous[key] = prevValue;
        changedFields.current[key] = currValue;
      }
    }
  }

  return changedFields;
}

function isDate(value: any): boolean {
  return (
    value instanceof Date ||
    (typeof value === 'string' && !isNaN(Date.parse(value)))
  );
}

export function createKeyFromName(input: string): string {
  return input
    .split(' ')
    .map((word) => word.toUpperCase())
    .join('_');
}
