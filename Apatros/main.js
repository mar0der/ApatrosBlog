require.config({
    paths: {
        //libs
        'controller': 'controllers/controller',
        'jquery': 'libs/jquery/dist/jquery',
        'mustache': 'libs/mustache/mustache',
        'Q': 'libs/q/q',
        'sammy': 'libs/sammy/main',
        'noty': 'libs/noty/js/noty/packaged/jquery.noty.packaged',
        'lodash': 'libs/lodash/lodash',
        //models views controllers
        'config': 'config',
        'ajaxRequesterModel': 'models/ajaxRequesterModel',
        'appRepository': 'models/appRepository',
        'credentialsModel': 'models/credentialsModel',
        'postsRepoModel': 'models/postsRepoModel',
        'postModel': 'models/postModel',
        'postDateModel': 'models/postDateModel',
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
        'profileView': 'views/profileView',
        'logoutView': 'views/logoutView',
        'registerView': 'views/registerView',
        'tagsView': 'views/tagsView',
        'archiveView': 'views/archiveView',
        'menuView': 'views/menuView',
        'mostFamousTagsView': 'views/mostFamousTagsView',
        'commentsView': 'views/commentsView',
        'notFoundView': 'views/notFoundView',
        //helpers
        'registrationValidator': 'helpers/registration-validator',
        'notifications': 'helpers/notifications'
    },
    shim: {
        'noty': ['jquery']
    }
});

require(['sammy', 'controller', 'appRepository', 'config', 'noty', 'jquery'],
    function (Sammy, Controller, appRepo, config) {

        var container = $('#content'),
            model = appRepo.load(config.baseUrl),
            controller = Controller.load(model),
            router;

        controller.init(container);

        router = Sammy(function () {

            this.get('#/posts', function () {
                controller.loadPosts(container);
            });

            this.get('#/archive/:date', function () {
                controller.loadArchiveByPeriod(container, this.params['date']);
            });

            this.get('#/view-post-by-tag/:tagId', function(){
                controller.loadPostsByTag(container, this.params.tagId);
            });

            this.get('#/view-post/:id', function () {
                controller.loadPost(container, this.params['id']);
            });

            this.get('#/login', function () {
                controller.loadLogin(container);
            });
           
            this.get('#/profile', function () {
                controller.loadProfile(container);
            });

            this.get('#/register', function () {
                controller.loadRegister(container);
            });

            this.get('#/writePost', function () {
                controller.loadAddPost(container);
            });

            this.notFound = function (method, url) {
                controller.loadNotFound(container, url);
            }
        });


        router.run('#/posts');

    });
