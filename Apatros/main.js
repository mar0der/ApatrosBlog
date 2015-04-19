require.config({
    paths: {
        'ajaxRequesterModel': 'models/ajaxRequesterModel',
        'controller': 'controllers/controller',
        'jquery': 'libs/jquery/dist/jquery',
        'mustache': 'libs/mustache/mustache',
        'Q': 'libs/q/q',
        'sammy': 'libs/sammy/main',
        'config': 'config',
        'postsRepoModel': 'models/postsRepoModel',
        'postModel': 'models/postModel',
        'postsView' : 'views/postsView',
        'postView' : 'views/postView',
        'addPostView': 'views/addPostView',
        'editPostView': 'views/editPostView',
        'loginView': 'views/loginView',
        'registerView': 'views/registerView',
        'tagsView' : 'views/tagsView'
    }
});

require(['sammy', 'controller', 'postsRepoModel', 'jquery'],
    function (Sammy, Controller, postsRepoModel) {

    var model = postsRepoModel.load('https://api.parse.com/1');
    var controller = Controller.load(model);

    var router = Sammy(function() {
        var selector = $('#content');

        this.get('#/posts', function() {
            controller.loadPosts(selector);
        });

        this.get('#/login', function () {
            controller.loadLogin(selector);
        });

        this.get('#/register', function () {
            controller.loadRegister(selector);
        });

        this.get('#/writePost', function () {
            controller.loadAddPost(selector);
        });
    });
    router.run('#/posts');
});