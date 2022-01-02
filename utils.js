const debounce = (callback, delay = 1000) => {
    let timoutId;
    return (...args) => {
        if (timoutId)
            clearTimeout(timoutId);
        timoutId = setTimeout(() => {
            callback.apply(null, args);
        }, delay);
    };

};