import React, { forwardRef, useEffect, useState } from 'react';

interface Props {

    onToggle?: ((isOpen: boolean) => void);
    
    summaryProps: React.ComponentPropsWithRef<'summary'>;
    contentContainerProps: React.ComponentPropsWithRef<'div'>;
    detailProps: React.ComponentPropsWithRef<'details'>;

};

export default function Details(props: Props) {
    function onToggle(e: React.ToggleEvent) {
        const newIsOpen = e.newState === 'open';
        
        if(props.onToggle) props.onToggle(newIsOpen);
    };

    return (
        <details {...props.detailProps} onToggle={onToggle}>
            <summary {...props.summaryProps} />

            <div {...props.contentContainerProps} />
        </details>
    );
};