export function isString(x: unknown): x is string {
    return typeof x === 'string';
}

export function isNumber(x: unknown): x is number {
    return typeof x === 'number';
}

export function isObject(x: unknown): x is object {
    return typeof x === 'object';
}