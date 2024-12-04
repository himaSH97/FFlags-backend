"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChangedFields = generateChangedFields;
exports.createKeyFromName = createKeyFromName;
function generateChangedFields(previousObj, currentObj, omitFields = []) {
    const changedFields = { previous: {}, current: {} };
    for (const key in previousObj) {
        if (previousObj.hasOwnProperty(key) && currentObj.hasOwnProperty(key)) {
            if (omitFields.includes(key)) {
                continue;
            }
            const prevValue = previousObj[key];
            const currValue = currentObj[key];
            if (isDate(prevValue) && isDate(currValue)) {
                const prevDate = new Date(prevValue).toISOString();
                const currDate = new Date(currValue).toISOString();
                if (prevDate !== currDate) {
                    changedFields.previous[key] = prevValue;
                    changedFields.current[key] = currValue;
                }
            }
            else if (prevValue !== currValue) {
                changedFields.previous[key] = prevValue;
                changedFields.current[key] = currValue;
            }
        }
    }
    return changedFields;
}
function isDate(value) {
    return (value instanceof Date ||
        (typeof value === 'string' && !isNaN(Date.parse(value))));
}
function createKeyFromName(input) {
    return input
        .split(' ')
        .map((word) => word.toUpperCase())
        .join('_');
}
//# sourceMappingURL=index.js.map