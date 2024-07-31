if (!window.va) {
    window.va =
        window.va ||
        (() => {
            // biome-ignore lint/suspicious/noAssignInExpressions: follow vercel analytics's docs
            // biome-ignore lint/style/noArguments: follow vercel analytics's docs
            (window.vaq = window.vaq || []).push(arguments);
        });
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
// biome-ignore lint/style/noVar: follow vercel analytics's docs
var pushState = history.pushState;
history.pushState = () => {
    // biome-ignore lint/style/noArguments: follow vercel analytics's docs
    pushState.apply(history, arguments);
    va('event', {
        name: window.location.pathname,
        data: {
            type: 'pageview',
            path: window.location.pathname,
        },
    });
};
