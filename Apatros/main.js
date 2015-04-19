require.config({
    paths: {
        'controller': 'controllers/controller',
        'jquery': 'libs/jquery/dist/jquery',
        'mustache': 'libs/mustache/mustache',
        'Q': 'libs/q/q',
        'sammy': 'libs/sammy/main',
        'config': 'config',
        'ajaxRequesterModel': 'models/ajaxRequesterModel',
        'appRepository': 'models/appRepository',
        'credentialsModel': 'models/credentialsModel',
        'postsRepoModel': 'models/postsRepoModel',
        'postModel': 'models/postModel',
        'commentsRepoModel': 'models/commentsRepoModel',
        'commentModel': 'models/commentModel',
        'tagsRepoModel': 'models/tagsRepoModel',
        'tagModel': 'models/tagModel',
        'usersRepoModel': 'models/usersRepoModel',
        'userModel': 'models/userModel',
        'postsView' : 'views/postsView',
        'postView' : 'views/postView',
        'addPostView': 'views/addPostView',
        'editPostView': 'views/editPostView',
        'loginView': 'views/loginView',
        'registerView': 'views/registerView',
        'tagsView' : 'views/tagsView'
    }
});

require(['sammy', 'controller', 'appRepository', 'config', 'jquery'],
    function (Sammy, Controller, appRepo, config) {

        var model = appRepo.load(config.baseUrl);
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