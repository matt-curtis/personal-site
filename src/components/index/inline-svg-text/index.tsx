import React, { useEffect, useImperativeHandle, useRef } from 'react';
import * as Wave from './waving/constants';

const wave = {
    offset: 6,
    scale: 0.9,

    brightness: 1,
    color: 'var(--interactive-color)',
    glow: {
        color: 'var(--accent-color)',
        radius: 10
    },

    duration: 1000,
    delay: 100,
    easing: 'ease-in-out'
};

interface TextProps {

    alt: string;
    width: number;
    height: number;
    baseline: number;
    paths: string[];

};

export function Text(props: TextProps) {
    const elRef = useRef<HTMLElement>(null);

    const style: React.CSSProperties = {
        position: 'relative',
        display: 'inline-block',
        width: (props.width / 16) + 'rem',
        height: '1em'
    };

    const childRefs: React.RefObject<React.ComponentRef<typeof Path> | null>[] = [];
    const children: React.JSX.Element[] = [];

    props.paths.forEach((path, i) => {
        const ref = React.createRef<React.ComponentRef<typeof Path>>();
        
        childRefs.push(ref);

        children.push(
            <Path
                key={i} index={i} d={path} ref={ref}
                width={props.width} height={props.height} baseline={props.baseline}
            />
        );
    });

    useEffect(() => {
        const el = elRef.current;

        if(!el) return;

        let abortController = new AbortController();
        let isWaving = false;

        async function wavePaths({ signal }: { signal: AbortSignal }) {
            const activeAnimationIndexes = new Set<number>();

            function animationIndexIsMin(i: number) {
                if(activeAnimationIndexes.size === 0) return false;

                return Math.min(...activeAnimationIndexes) == i;
            };

            const loops = childRefs.map(async (ref, i) => {
                let shouldDelay = true;

                activeAnimationIndexes.add(i);

                const shouldStop = () => animationIndexIsMin(i) && signal.aborted;

                while(!shouldStop()) {
                    await ref.current?.animate(shouldDelay);

                    shouldDelay = false;
                }

                activeAnimationIndexes.delete(i);
            });

            await Promise.all(loops);
        };

        async function waveStartTriggered() {
            abortController = new AbortController();

            if(isWaving) return;

            isWaving = true;
            
            while(!abortController.signal.aborted){
                await wavePaths(abortController);
            }

            isWaving = false;
        };

        function waveEndTriggered() {
            abortController.abort();
        };

        const eventAbortController = new AbortController();

        el.addEventListener(Wave.events.start, () => waveStartTriggered(), eventAbortController);
        el.addEventListener(Wave.events.end, () => waveEndTriggered(), eventAbortController);

        return () => {
            abortController.abort();
            eventAbortController.abort();
        };
    }, []);

    return (
        <span ref={elRef} style={style} {...Wave.listener}>
            {children}
            <span className='sr-only'>{props.alt}</span>
        </span>
    );
};

interface PathProps {

    ref?: React.Ref<{ animate: (shouldDelay: boolean) => Promise<void> }>;
    index: number; d: string;
    width: number; height: number;
    baseline: number;

};

function Path(props: PathProps) {
    const svgElRef = useRef<SVGSVGElement | null>(null);
    const peakElRef = useRef<SVGSVGElement | null>(null);

    useImperativeHandle(props.ref, () => {
        return {
            async animate(shouldDelay: boolean) {
                const el = svgElRef.current;
                const peakEl = peakElRef.current;

                if(!(el && peakEl)) return;

                const options = {
                    duration: wave.duration,
                    delay: shouldDelay ? wave.delay * props.index : 0,
                    easing: wave.easing
                };

                await Promise.all(
                    [
                        peakEl.animate(
                            [ { transform: waveTransform, opacity: 1, offset: 0.5 } ],
                            options
                        ),
                        el.animate(
                            [ { transform: waveTransform, offset: 0.5 } ],
                            options
                        )
                    ]
                    .map(animation => animation.finished)
                );
            }
        };
    }, []);

    const waveTransform = `
        translateY(${wave.offset}px)
        scaleY(${wave.scale})
    `;
        
    const waveGlowFilter = `
        drop-shadow(0 0 ${wave.glow.radius}px ${wave.glow.color})
        brightness(${wave.brightness})
    `;

    const svgStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: (props.baseline / 16) + 'rem',
        width: (props.width / 16) + 'rem',
        height: (props.height / 16) + 'rem',

        overflow: 'visible',
        
        transformOrigin: 'center',
        //  In Safari, this prevents a "glitchy" transition
        //  between no-animation and animation
        willChange: 'transform'
    };

    return (
        <>
            <svg
                ref={svgElRef}
                aria-hidden={true}
                viewBox={`0 0 ${props.width} ${props.height}`}
                style={svgStyle}
            >
                <path fill='var(--accent-color)' d={props.d} />
            </svg>

            <svg
                ref={peakElRef}
                aria-hidden={true}
                viewBox={`0 0 ${props.width} ${props.height}`}
                style={{ ...svgStyle, opacity: 0, filter: waveGlowFilter }}
            >
                <path fill={wave.color} d={props.d} />
            </svg>
        </>
    );
};

export const InlineSVGText = Text;