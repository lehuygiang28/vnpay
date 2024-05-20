if (!window.va) {
    window.va =
        window.va ||
        function () {
            (window.vaq = window.vaq || []).push(arguments);
        };
}

// page view one time when page loaded
va('event', {
    name: window.location.pathname,
    data: {
        type: 'pageview',
        path: window.location.pathname,
    },
});

// page view on every page if changed
var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    va('event', {
        name: window.location.pathname,
        data: {
            type: 'pageview',
            path: window.location.pathname,
        },
    });
};
