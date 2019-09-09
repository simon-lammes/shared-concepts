export function shuffle<T>(a: T[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function getArrayCopyWithoutValue<T>(array: T[], excludedValue: T) {
    const index = array.indexOf(excludedValue);
    const copy = [...array];
    if (index > -1) {
        copy.splice(index, 1);
    }
    return copy;
}
