define(['noty'], function (noty) {
    var notificationContainer = '#noty-container';
    function success(message) {
        $(notificationContainer).noty({
            layout: 'top',
            type: 'success',
            text: message,
            dismissQueue: true,
            animation: {
                open: { height: 'toggle' },
                close: { height: 'toggle' },
                easing: 'swing',
                speed: 500
            },
            timeout: 2000
        });
    }
    return {
        'success': success
    }
});