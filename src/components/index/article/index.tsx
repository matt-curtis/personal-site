import React from 'react';
import Details from '../details';
import * as InlineSVGTextWave from '../inline-svg-text/waving/constants.ts';
import styles from './style.module.css';
import { useDetailsAnimator } from '../useDetailsAnimator.tsx';
import TLDR from '../tldr/index.tsx';
import { VisitLink } from '../visit-link/index.tsx';

interface Props {

    icon: React.ReactNode;
    summary: React.ReactNode;
    /* This used to be typed as a react node, but when strings are passed in from Astro {'...'} it causes a rehydration bug */
    tldr: string;
    summaryBreak?: React.ReactNode;
    content: React.ReactNode;
    visitLink: {
        name: string;
        href: string;
        thumbSrc: string;
    }

};

export default function Article(props: Props) {
    const animator = useDetailsAnimator();

    return (
        <Details
            detailProps={{
                ref: animator.detailsRef,
                className: styles['article']
            }}
            summaryProps={{
                ...InlineSVGTextWave.trigger,
                className: styles['summary'],
                children: (<>
                    <div className={styles['icon']} aria-hidden={true}>
                        {props.icon}
                    </div>
                    <div className={styles['summary-text']}>
                        {props.summary}
                        <span className={styles['summary__break']}>
                            {props.summaryBreak}&nbsp;<DisclosureIndicator />
                        </span>
                    </div>
                </>)
            }}
            contentContainerProps={{
                ref: animator.contentRef,
                className: styles['content'],
                children: (<>
                    <div className={styles['interactive-stack']}>
                        <VisitLink
                            href={props.visitLink.href}
                            site={props.visitLink.name}
                            thumbSrc={props.visitLink.thumbSrc}
                        />
                        {/* We're automatically adding a paragraph around this text so it's styled correctly */}
                        <TLDR><p>{props.tldr}</p></TLDR>
                    </div>

                    {props.content}
                </>)
            }}
        />
    );
};

function DisclosureIndicator() {
    const width = 23, height = 40;
    const remWidth = (width / 16) + 'rem';
    const remHeight = (height / 16) + 'rem';

    return (
        <span
            aria-hidden="true"
            className={styles['disclosure-indicator-container']}
            style={{ width }}
        >
            <svg
                className={styles['disclosure-indicator']}
                viewBox={`0 0 ${width} ${height}`}
                style={{
                    width: remWidth, height: remHeight,
                    left: `calc(50% - ${remWidth})`
                }}
            >
                <path className={styles['disclosure-indicator-path']} d="M1.92.75a.96.96 0 1 0-1.84.5q.09.28.16.38a3 3 0 0 0 .4.55q.25.3.5.57.5.53 1 1.02c4.39 4.2 9.05 7.98 13.76 11.73l.03.02c1.98 1.58 3.98 3.43 4.63 5.56l.01.05.24-.91A153 153 0 0 1 3.75 36.5l-.1.08-.07.06-.44.5c-.06.09-.12.17-.2.34q-.06.1-.1.38c-.02.18.04.56.27.8s.43.3.56.33q.18.04.28.04l.33-.02q.26-.04.45-.1c.52-.13.95-.28 1.4-.43a.96.96 0 0 0-.61-1.81q-.68.23-1.26.4l-.23.04H4l.11.02c.08.02.22.05.4.25.2.2.25.52.23.64q-.03.2-.05.22l-.02.03.25-.27-.07.07.1-.09a155 155 0 0 0 17.22-16.43l.38-.4-.14-.52-.02-.07c-.97-3-3.2-4.83-5.28-6.54l-.03-.02C12.4 10.28 7.74 6.5 3.49 2.4A29 29 0 0 1 2.11.98L1.95.75C1.9.7 1.86.58 1.92.75"/>
            </svg>
        </span>
    );
};

export const AstroAdaptedArticle = Article as (props: Omit<Props, 'icon' | 'summary' | 'content' | 'summaryBreak'>) => React.JSX.Element;