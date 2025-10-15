import * as Wave from './constants';

const triggers = document.querySelectorAll(`[${Wave.attributes.trigger}]`);

triggers.forEach(trigger => {
    function dispatchEventToListeners(eventName: string, parent: Element) {
        const listeners = trigger.querySelectorAll(`[${Wave.attributes.listener}]`);
        
        listeners.forEach(listener => {
            listener.dispatchEvent(new CustomEvent(eventName));
        });
    };

    trigger.addEventListener('pointerenter', () => {
        dispatchEventToListeners(Wave.events.start, trigger);
    });

    trigger.addEventListener('pointerleave', () => {
        dispatchEventToListeners(Wave.events.end, trigger);
    });

    trigger.addEventListener('pointercancel', () => {
        dispatchEventToListeners(Wave.events.end, trigger);
    });
});