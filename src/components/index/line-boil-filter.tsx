//  Basically taken from:
//  https://camillovisini.com/coding/simulating-hand-drawn-motion-with-svg-filters

export function LineBoilFilter(props: { id: string }) {
    const displacementMapScale = 3;
    const baseFrequency = 0.020;
    const offsets = [-0.02, 0.01, -0.01, 0.02];
    const animationScale = 0.25;
    const tickMs = 100;

    const values = offsets
        .map(offset => baseFrequency + offset * animationScale)
        .join(';');

    return (
        <filter id={props.id}>
            {/* Step 1: Create a turbulence field to generate noise */}
            <feTurbulence
                type="turbulence"
                baseFrequency={baseFrequency}
                numOctaves="2"
                seed="1"
                result="noise"
            >
                <animate
                    attributeName="baseFrequency"
                    values={values}
                    dur={`${offsets.length * tickMs}ms`}
                    repeatCount="indefinite"
                    calcMode="discrete"
                />
            </feTurbulence>

            {/* Step 2: Use the noise (in2) to displace the image (in) */}
            <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={displacementMapScale}
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
    );
}
