/**
 * Форматирует 9-ти значное число/строку: 
 * если число 9-ти значное, то добавляет точку после 3-го символа
 * @param input - число/строка
 * @returns отформатированная строка
 */

export function formatNumber(input: number | string): string {
    const numStr = input.toString();

    if (/^\d{9}$/.test(numStr)) {
        const withDecimal = numStr.slice(0, 3) + '.' + numStr.slice(3);
        return formatDecimal(withDecimal);
    }

    return formatDecimal(numStr);
}

/**
 * Форматирует значения после точки:
 * если значения после точки состоят из 0, то удаляет их и возвращает целое число:
 * - 123.000000 -> 123;
 * если в десятичной части присутсвует значения больше 0 и последующие значения равны 0, то возвращается число с 2-мя знаками после точки:
 * - 123.100000 -> 123.10 || 123.010000 -> 123.01
 * если какое-либо значение после десятичной части больше 0, то возвращается неотформатированное число:
 * - 123.100001 -> 123.100001
 * @param numStr - число/строка
 * @returns отформатированная строка
 */

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

export function calculateTimeLeft(
    expirationDateStr: string | undefined,
    totalDurationMs: number = 15 * 60 * 1000,
    initialFillPercentage: number = 15
) {
    if (!expirationDateStr) {
        return { timeLeft: "00:00:00", progressPercentage: 100 };
    }

    const expirationDate = new Date(expirationDateStr);
    const now = new Date();
    const timeDifference = expirationDate.getTime() - now.getTime();

    const calculatedPercentage = Math.min(
        100,
        Math.max(
            initialFillPercentage,
            initialFillPercentage + (100 - initialFillPercentage) * (1 - timeDifference / totalDurationMs),
        ),
    );

    if (timeDifference > 0) {
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        return { timeLeft: formattedTime, progressPercentage: calculatedPercentage };
    } else {
        return { timeLeft: "00:00:00", progressPercentage: 100 };
    }
}
