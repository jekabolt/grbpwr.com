type ColorMap = {
    [key: number]: string;
};

const COLOR_MAP: ColorMap = {
    0: 'background: transparent;',
    1: 'background: #000000; border: 1px solid #1a1a1a;',
    2: 'background: #ffffff; border: 1px solid #e5e5e5;',
};

const ART_GRID: number[][] = [
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1]
];

export const initConsoleArt = (): void => {
    if (typeof window === 'undefined') return;

    let logString = '\n';
    const stylesArray: string[] = [];

    ART_GRID.forEach((row) => {
        row.forEach((pixelValue) => {
            logString += '%c  ';
            const baseStyle = COLOR_MAP[pixelValue] || 'background: transparent;';

            stylesArray.push(`${baseStyle} padding: 4px 0; line-height: 14px; font-size: 10px;`);
        });
        logString += '\n';
    });


    console.log(logString, ...stylesArray);
}