﻿define(['postsView', 'postView', 'tagsView',
        'loginView', 'registerView', 'addPostView'],
    function (postsView, postView, tagsView,
              loginView, registerView, addPostView) {

        var attachRegisterHandler,
            attachLoginHandler,
            attachAddPostHandler,
            attachAddCommentHandler;

        function Controller(model) {
        this.model = model;
        }

        Controller.prototype.init = function (container) {
            attachRegisterHandler.call(this, container);
            attachLoginHandler.call(this, container);
            attachAddPostHandler.call(this, container);
            attachAddCommentHandler.call(this, container);
        }

        Controller.prototype.loadPosts = function (container) {
            this.model.posts.getPosts().then(
                function (data) {
                    postsView.load(container, data);
                }
            )
        };

        Controller.prototype.loadPost = function (container, id) {
            this.model.posts.getPost(id).then(
                function (post) {
                    postView.load(container, post);
                }
            )
        };

        Controller.prototype.loadTags = function (container) {
            //TODO: Load Tags logic
            tagsView.load(container);
        };

        Controller.prototype.loadLogin = function (container) {
            loginView.load(container);
            //TODO: Login Logic
        };

        Controller.prototype.loadRegister = function (container) {
            registerView.load(container);
            //TODO: Register Logic
        };

        Controller.prototype.loadAddPost = function (container) {
            //TODO: Add Post Logic
            addPostView.load(container);
        };

        var attachRegisterHandler = function attachRegisterHandler(container) {
            var _this = this;
            container.on('click', '#submit-registration', function(ev) {
                alert('regestration submit');
            });
        }

        var attachLoginHandler = function attachLoginHandler(container) {
            var _this = this;
            container.on('click', '#submit-login', function (ev) {
                alert('login submit');
            });
        }

        var attachAddPostHandler = function attachAddPostHandler(container) {
            var _this = this;
            container.on('click', '#submit-post', function (ev) {
                alert('add post submit');
            });
        }

        var attachAddCommentHandler = function attachAddCommentHandler(container) {
            var _this = this;
            container.on('click', '#submit-post', function (ev) {
                alert('add comment submit');
            });
        }

        return {
            load: function (model) {
                return new Controller(model);
            }
        }
});