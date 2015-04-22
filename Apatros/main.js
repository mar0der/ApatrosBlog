require.config({
    paths: {
        'controller': 'controllers/controller',
        'jquery': 'libs/jquery/dist/jquery',
        'mustache': 'libs/mustache/mustache',
        'Q': 'libs/q/q',
        'sammy': 'libs/sammy/main',
        'noty': 'libs/noty/js/noty/packaged/jquery.noty.packaged',
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
        'tagsPostsRepoModel': 'models/tagsPostsRepoModel',
        'postsView': 'views/postsView',
        'postView': 'views/postView',
        'addPostView': 'views/addPostView',
        'editPostView': 'views/editPostView',
        'loginView': 'views/loginView',
        'logoutView': 'views/logoutView',
        'registerView': 'views/registerView',
        'tagsView': 'views/tagsView',
        'registrationValidator': 'helpers/registration-validator'
    },
    shim: {
        'noty': ['jquery']
    }
});

require(['sammy', 'controller', 'appRepository', 'config', 'noty', 'jquery'],
    function (Sammy, Controller, appRepo, config) {

        var container = $('#content');
        var model = appRepo.load(config.baseUrl);
        var controller = Controller.load(model);
        var router;
        controller.init(container);

        router = Sammy(function () {

            this.get('#/posts', function () {
                controller.loadPosts(container);
            });
            this.get('#/view-post/:id', function () {
                controller.loadPost(container, this.params['id']);
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
