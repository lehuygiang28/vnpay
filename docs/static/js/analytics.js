/* eslint-disable no-undef */
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
// Disable rule follow vercel analytics's docs
// eslint-disable-next-line no-var
const pushState = history.pushState;
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
