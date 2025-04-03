
export function formatNumber(input: number | string): string {
    const numStr = input.toString();

    if (/^\d{9}$/.test(numStr)) {
        const withDecimal = numStr.slice(0, 3) + '.' + numStr.slice(3);
        return formatDecimal(withDecimal);
    }

    return formatDecimal(numStr);
}

function formatDecimal(numStr: string): string {
    if (!numStr.includes('.')) return numStr;

    const [intPart, decPart] = numStr.split('.');

    if (/^0*$/.test(decPart)) {
        return intPart;
    }

    const hasSignificantDigitsAfterPos2 = /[1-9]/.test(decPart.slice(2));

    if (hasSignificantDigitsAfterPos2) {
        return `${intPart}.${decPart.replace(/0+$/, '')}`;
    } else {
        return `${intPart}.${decPart.slice(0, 2).padEnd(2, '0')}`;
    }
}