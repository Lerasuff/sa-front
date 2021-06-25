export function requireField(value: string | undefined | null): null | 'Обязательное поле' {
    if (typeof value === "string") {
        value = value.trim();
    }

    if (['', null, undefined].indexOf(value) !== -1) {
        return 'Обязательное поле'
    }

    return null;
}