import { useEffect, useRef } from 'react';

export function useDetailsAnimator() {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const activeAnimationsRef = useRef<Animation[]>([]);

    useEffect(() => {
        const { current: detailsEl } = detailsRef;
        const { current: contentEl } = contentRef;

        if(!detailsEl || !contentEl) return;

        const abortController = new AbortController();

        const styles = {
            hidden: {
                opacity: '0',
                transform: 'scale(0.98) translateY(20px)'
            },
            visible: {
                opacity: '1',
                transform: 'scale(1) translateY(0)'
            }
        };

        const updateModelStyle = () => {
            const style = detailsEl.open ? styles.visible : styles.hidden;

            contentEl.style.opacity = style.opacity;
            contentEl.style.transform = style.transform;
        };

        updateModelStyle();

        detailsEl.addEventListener('toggle', e => {
            const isOpen = e.newState === 'open';

            activeAnimationsRef.current.forEach(animation => animation.cancel());
            activeAnimationsRef.current = [];

            updateModelStyle();

            if(!isOpen) return;

            const easeOutExpoEasing = 'cubic-bezier(0.16, 1, 0.3, 1)';
            
            activeAnimationsRef.current = [
                contentEl.animate(
                    [
                        { offset: 0, opacity: styles.hidden.opacity },
                        { offset: 1, opacity: styles.visible.opacity }
                    ],
                    { easing: 'ease-out', duration: 300 }
                ),
                contentEl.animate(
                    [
                        { offset: 0, transform: styles.hidden.transform },
                        { offset: 1, transform: styles.visible.transform }
                    ],
                    { easing: easeOutExpoEasing, duration: 350 }
                )
            ];
        }, abortController);

        return () => {
            abortController.abort();
        };
    }, [detailsRef.current, contentRef.current]);

    return { detailsRef, contentRef };
};