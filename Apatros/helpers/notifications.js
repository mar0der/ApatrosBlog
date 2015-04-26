define(['noty'], function (noty) {
    var notificationContainer = '#noty-container';
    function notification(layout, type, message, dismissQueue, open, close, easing, speed, timeout, closeWith) {
        $(notificationContainer).noty({
            layout: layout,
            type: type,
            text: message,
            dismissQueue: dismissQueue,
            animation: {
                open: { height: open },
                close: { height: close },
                easing: easing,
                speed: speed
            },
            timeout: timeout,
            closeWith: closeWith
        });
    }

    function success(message) {
        notification('top', 'success', message, true, 'toggle', 'toggle', 'swing', 500, 2000, ['click']);
    }

    function error(message) {
        notification('top', 'error', message, true, 'toggle', 'toggle', 'swing', 500, 0, ['button']);
    }

    function information(message) {
        notification('top', 'information', message, true, 'toggle', 'toggle', 'swing', 500, 0, ['click']);
    }

    function clear() {
        $(notificationContainer).html('');
    }
    return {
        'success': success,
        'error': error,
        'info': information,
        'clear': clear
    }
});