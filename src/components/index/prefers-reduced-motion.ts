import { useEffect, useRef, useState } from 'react';

function createMediaQuery(): MediaQueryList | undefined {
    //  This might be running on the server, in which case we won't be able
    //  to access window.matchMedia (window won't exist)

    return globalThis?.window?.matchMedia('(prefers-reduced-motion: reduce)');
};

/** Defaults to `false` server-side. */

export function prefersReducedMotion(): boolean {
    return createMediaQuery()?.matches ?? false;
};

/** Defaults to `false` server-side. */

export function usePrefersReducedMotion(): boolean {
    const mediaQueryRef = useRef(createMediaQuery());
    const [prefers, setPrefers] = useState(mediaQueryRef.current?.matches ?? false);

    useEffect(() => {
        const mediaQuery = mediaQueryRef.current;

        if(!mediaQuery) return;

        const abortController = new AbortController();

        mediaQuery.addEventListener('change', () => {
            setPrefers(mediaQuery.matches);
        }, abortController);

        return () => abortController.abort();
    }, []);

    return prefers;
};