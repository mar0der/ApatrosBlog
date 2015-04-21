define(['postsView', 'postView', 'tagsView',
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
        };

        Controller.prototype.loadPosts = function (container) {
            this.model.posts.getPosts().then(
                function(data) {
                    postsView.load(container, data);
                }
            );
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
        };

        var attachLoginHandler = function attachLoginHandler(container) {
            var _this = this;
            container.on('click', '#submit-login', function (ev) {
                alert('login submit');
            });
        };

        var attachAddPostHandler = function attachAddPostHandler(container) {
            var _this = this;
            container.on('click', '#submit-post', function (ev) {
                var postTitle = $('#post-title').val().trim();
                var postBody = $('#post-body').val().trim();
                var postTags = $('#post-tags').val().trim();
                var postId;
                var tagsIds = [];
                addPostView.loading(container);
                _this.model.posts.addPost(postTitle, postBody).then(
                    function(data){
                        postId = data.objectId;
                        return _this.model.tags.addTags(postTags);
                    }).then(function(data){
                        data.forEach(function (value){
                            tagsIds.push(value.success.objectId);
                        });

                        return _this.model.tagsPosts.addTagsPosts(tagsIds, postId);
                    }).then(
                        function(){
                            window.location.hash = '/view-post/' + postId;
                        },
                        function(error){
                            console.log(error.responseText);
                        }
                    );
            });
        };

        var attachAddCommentHandler = function attachAddCommentHandler(container) {
            var _this = this;
            container.on('click', '#submit-comment', function (ev) {
                var commentContent = $('#comment-content').val();
                var postId = $('#post-container').data('id');
                if (commentContent) {
                    _this.model.comments.add(commentContent, postId);
                } else {
                    alert('add noty error');
                }
            });
        };

        return {
            load: function (model) {
                return new Controller(model);
            }
        }
});