require.config({
    paths: {
        'ajaxRequester': 'models/ajaxRequester',
        'model': 'models/model',
        'controller': 'controllers/controller',
        'jquery': 'libs/jquery/dist/jquery',
        'mustache': 'libs/mustache/mustache',
        'Q': 'libs/q/q',
        'sammy': 'libs/sammy/main',
        'config': 'config'
    }
});

require(['sammy', 'controller', 'jquery'], function (Sammy, controller) {
    
    var container = $('#content');
    controller.init(container);
    var router = Sammy(function() {
        this.get('#/posts', function() {
            controller.loadBooks(container);
        });

        this.get('#/writepost', function () {
            controller.loadTags(container);
        });
    });
    router.run('#/post');
});