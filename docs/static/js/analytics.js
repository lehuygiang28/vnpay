if (!window.va) {
    window.va =
        window.va ||
        function () {
            (window.vaq = window.vaq || []).push(arguments);
        };
}

va('event', {
    name: window?.location?.pathname ?? 'default-path',
    data: {
        type: 'pageview',
    },
});
