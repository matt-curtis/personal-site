import * as Wave from './constants';

const triggers = document.querySelectorAll(`[${Wave.attributes.trigger}]`);

triggers.forEach(trigger => {
    function dispatchEventToListeners(eventName: string, parent: Element) {
        const listeners = trigger.querySelectorAll(`[${Wave.attributes.listener}]`);
        
        listeners.forEach(listener => {
            listener.dispatchEvent(new CustomEvent(eventName));
        });
    };

    trigger.addEventListener('mouseenter', () => {
        dispatchEventToListeners(Wave.events.start, trigger);
    });

    trigger.addEventListener('mouseleave', () => {
        dispatchEventToListeners(Wave.events.end, trigger);
    });
});