requirejs.config({
    baseUrl: 'scripts',

    paths: {
        // Libraries
        jQuery: '../libs/jQuery-2.1.3-min',
        mustache: '../libs/mustache-0.8.1-min',
        Q: '../libs/Q-2.0.3-min',
        sammy: '../libs/sammy-0.7.6-min',

        // Main
        app: 'app',

        // Config
        constants: 'config/constants'

        // Models

    },

    shim: {
        sammy: {
            deps: ['jQuery'],
            exports: 'sammy'
        }
    }
});

requirejs(['app'], function () {
});