define(['postsView', 'postView', 'tagsView',
        'loginView', 'registerView', 'addPostView'],
    function (postsView, postView, tagsView,
              loginView, registerView, addPostView) {

        function Controller(model) {
        this.model = model;
        }

        Controller.prototype.loadPosts = function (selector) {
            this.model.posts.getPosts().then(
                function (data) {
                    postsView.load(selector, data);
                }
            )
        };

        Controller.prototype.loadPost = function (selector, id) {
            this.model.posts.postsRepo.posts.forEach(function (post) {
                if (post.id == id) {
                    postView.load(selector, post);
                }
            })
        };

        Controller.prototype.loadTags = function (selector) {
            //TODO: Load Tags logic
            tagsView.load(selector);
        };

        Controller.prototype.loadLogin = function (selector) {
            loginView.load(selector);
            //TODO: Login Logic
        };

        Controller.prototype.loadRegister = function (selector) {
            registerView.load(selector);
            //TODO: Register Logic
        };

        Controller.prototype.loadAddPost = function (selector) {
            //TODO: Add Post Logic
            addPostView.load(selector);
        };

        return {
            load: function (model) {
                return new Controller(model);
            }
        }
});