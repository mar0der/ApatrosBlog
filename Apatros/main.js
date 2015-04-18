require.config({
    paths: {
        'ajaxRequester': 'models/ajaxRequester',
        'model': 'models/model',
        'controller': 'controllers/controller',
        'jquery': 'libs/jquery/dist/jquery',
        'mustache': 'libs/mustache/mustache',
        'Q': 'libs/q/q',
        'sammy': 'libs/sammy/main',
        'config': 'config',
        'postModel': 'models/postModel',
        'modelRepo': 'models/modelRepo',
        'postView' : 'views/postView'
    }
});

require(['sammy', 'controller', 'jquery'], function (Sammy, controller) {
    
    var container = $('#content');
    controller.init(container);
    var router = Sammy(function() {
        this.get('#/posts', function() {
            controller.loadPosts(container);
        });

        this.get('#/login', function () {
            controller.loadLogin(container);
        });

        this.get('#/register', function () {
            controller.loadRegister(container);
        });

        this.get('#/writePost', function () {
            controller.loadAddPost(container);
        });
    });
    router.run('#/posts');
});