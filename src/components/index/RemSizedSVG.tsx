import React from 'react';

export function RemSizedSVG(props: React.PropsWithChildren<{ width: number, height: number }>) {
    const svgProps = remSizedSVGProps(props.width, props.height);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" {...svgProps}>
            {props.children}
        </svg>
    );
};

export function remSizedSVGProps(width: number, height: number) {
    const viewBox = `0 0 ${width} ${height}`;
    const style = {
        width: (width / 16) + 'rem',
        height: (height / 16) + 'rem'
    };

    return { viewBox, style };
};