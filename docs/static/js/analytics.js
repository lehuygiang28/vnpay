if (!window.va) {
    window.va =
        window.va ||
        function () {
            (window.vaq = window.vaq || []).push(arguments);
        };
}

var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    va('event', {
        name: window.location.pathname,
        data: {
            type: 'pageview',
        },
    });
};
