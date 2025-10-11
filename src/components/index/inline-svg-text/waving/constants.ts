export const attributes = {
    trigger: 'data-wave-trigger',
    listener: 'data-wave-listener'
};

export const events = {
    start: 'wavestarttriggered',
    end: 'waveendtriggered'
};

export const trigger = { [attributes.trigger]: '' };
export const listener = { [attributes.listener]: '' };