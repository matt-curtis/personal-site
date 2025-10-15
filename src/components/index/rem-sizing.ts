export function from(pixelValue: number) {
    return pixelValue / 16;
};

export function cssValueFrom(pixelValue: number) {
    return from(pixelValue) + 'rem';
};

export function fromValues(pixelValues: number[]) {
    return pixelValues.map(from);
};

export function cssValuesFrom(pixelValues: number[]) {
    return pixelValues.map(cssValueFrom);
};

export function fromSize(pixelSize: { width: number, height: number }) {
    return { width: from(pixelSize.width), height: from(pixelSize.height) };
};

export function cssValuesFromSize(pixelSize: { width: number, height: number }) {
    return { width: cssValueFrom(pixelSize.width), height: cssValueFrom(pixelSize.height) };
};