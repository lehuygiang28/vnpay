export function dateFormat(date: Date, format = 'yyyyMMddHHmmss'): number {
    const pad = (n: number) => (n < 10 ? `0${n}` : n).toString();
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return Number(
        format
            .replace('yyyy', year.toString())
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second),
    );
}

export function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += `${characters[(Math.random() * charactersLength) | 0]}`;
    }
    return result;
}
