define(['notifications', 'postsView', 'postView', 'tagsView', 'profileView',
        'loginView', 'registerView', 'addPostView',
        'archiveView', 'credentialsModel', 'menuView', 'commentsView',
        'mostFamousTagsView', 'notFoundView', 'config'],
    function (noty, postsView, postView, tagsView, profileView,
              loginView, registerView, addPostView,
              archiveView, credentials, menuView, commentsView,
              mostFamousTagsView, notFoundView, config) {

        var leftAside = $('#left'),
            rightAside = $('#right'),
            mainMenu = $('#main-menu'),
            commentsContainerSelector = '#comments-container';

        function Controller(model) {
            this.model = model;
            this.noty = noty;
            this.credentials = credentials;
        }

        Controller.prototype.init = function (container) {
            attachRegistrationHandler.call(this, container);
            attachLoginHandler.call(this, container);
            attachLogoutHandler.call(this);
            attachAddPostHandler.call(this, container);
            attachAddCommentHandler.call(this, container);
            attachEditCommentHandler.call(this, container);
            attachDeleteCommentHandler.call(this, container);
            loadMostFamousTags.call(this);
            loadArchivePanel.call(this);
            menuView.load(mainMenu, this);
        };

        //Load routes
        Controller.prototype.isLogged = function isLogged() {
            if (sessionStorage['sessionToken']) {
                return true;
            }
            return false;
        }

        Controller.prototype.isAdmin = function isAdmin() {
            if (credentials.getUserRole() === config.adminRoleId) {
                return true;
            }
            return false;
        }

        Controller.prototype.loadPosts = function (container) {
            postsView.loading(container);
            this.model.posts.getPosts('&limit=' + config.defaultPostPerPage).then(
                function (data) {
                    postsView.load(container, data);
                }
            );
        };

        Controller.prototype.loadArchiveByPeriod = function (container, date) {
            postsView.loading(container);
            this.model.posts.getArchiveByPeriod(date).then(
                function (data) {
                    postsView.load(container, data);
                }
            );
        };

        Controller.prototype.loadPost = function (container, id) {
            var _this = this;
            this.model.posts.getPost(id).then(
                function (post) {
                    postView.load(container, post);
                    return _this.model.comments.getByPostId(id);
                }).then(function (data) {
                    commentsView.load(_this, commentsContainerSelector, data);
                }, function (error) {
                    noty.error(error.responseJSON.error);
                });
        };

        Controller.prototype.loadPostsByTag = function loadPostsByTag(container, tagId) {
            var _this = this;
            postsView.loading(container);
            this.model.tagsPosts.getPostsIdsByTagId(tagId).then(
                function (data) {
                    return _this.model.posts.getPostsByIds(data);
                }
            ).then(
                function (data) {
                    postsView.load(container, data);
                },
                function (error) {
                    noty.error(error.responseJSON.error);
                }
            );
        };

        Controller.prototype.loadTags = function (container) {
            tagsView.load(container);
        };

        Controller.prototype.loadProfile = function (container) {
            this.model.users.getUser(credentials.getUserId()).then(function (user) {
                profileView.load(container, user);
            });
        };

        Controller.prototype.loadLogin = function (container) {

            if (this.isLogged()) {
                window.location.hash = config.defaultRoute;
            } else {
                loginView.load(this, container);
            }
        };

        Controller.prototype.loadRegister = function (container) {
            if (this.isLogged()) {
                window.location.hash = config.defaultRoute;
            } else {
                registerView.load(this, container);
            }
        };

        Controller.prototype.loadAddPost = function (container) {
            addPostView.load(container);
        };

        Controller.prototype.loadNotFound = function loadNotFound(container, url) {
            notFoundView.load(container, url);
        }

        //Load SideBars
        function loadArchivePanel() {
            this.model.posts.getPostsDates().then(
                function (data) {
                    archiveView.load(leftAside, filterArchives(data));
                }
            );

            function filterArchives(data) {
                var uniqueDates = [],
                    uniqueObjects = { dates: [] };
                for (var dateObj in data.dates) {
                    var d = data.dates[dateObj].date;
                    if (uniqueDates.indexOf(d) < 0) {
                        uniqueDates.push(d);
                        uniqueObjects.dates.push({ date: d });
                    }
                }
                return uniqueObjects;
            }
        };

        function loadMostFamousTags() {
            this.model.tagsPosts.getMostFamousTags(config.defaultTagsLimit).then(
                function (data) {
                    mostFamousTagsView.load(rightAside, data);
                },
                function (error) {
                    noty.error(error.responseJSON.error);
                }
            );
        };

        //Event Handlers
        function attachRegistrationHandler(container) {
            var _this = this;
            container.on('click', '#submit-registration', function (ev) {
                var registrationInfo = registerView.parseRegistrationInfo();
                var newUser = {
                    username: registrationInfo[0],
                    password: registrationInfo[1],
                    email: registrationInfo[3],
                    firstName: registrationInfo[4],
                    lastName: registrationInfo[5]
                };

                _this.model.users.addUser(newUser)
                    .then(function (addUserData) {
                        credentials.setUserId(addUserData['objectId']);
                        credentials.setSessionToken(addUserData['sessionToken']);
                        credentials.setUsername(newUser.username);
                        _this.model.users.assignRole()
                        .then(function () {
                            noty.clear();
                            noty.success('You have successfully registered!');
                            menuView.load(mainMenu, _this);
                            window.location.hash = '/posts?hidenoty=true';
                        });
                    }, function (error) {
                        noty.error(error.responseJSON.error);
                    });
            });
        }

        function attachLoginHandler(container) {
            var _this = this;
            container.on('click', '#submit-login', function () {
                var username = $('#username').val();
                var password = $('#password').val();
                var user = {
                    username: username,
                    password: password
                };
                _this.model.users.loginUser(user)
                    .then(function(data) {
                        credentials.setSessionToken(data['sessionToken']);
                        credentials.setUserId(data['objectId']);
                        credentials.setUsername(data['username']);
                        if (data['role']) {
                            credentials.setUserRole(data['role'].objectId);
                        }
                        return _this.model.users.getUser(credentials.getUserId());

                    })
                    .then(function (data) {
                        var emailVerified = data['emailVerified'];

                        if (!emailVerified) {
                            noty.info('Please verify your email address');
                        }
                        menuView.load(mainMenu, _this);
                        window.location.hash = config.defaultRoute;
                    }, function (error) {
                        noty.error(error.responseJSON.error);
                    });
            });
        };

        function attachLogoutHandler() {
            var _this = this;
            $('body').on('click', '#submit-logout', function (ev) {
                _this.model.users.logoutUser()
                .then(function () {
                    sessionStorage.clear();
                    menuView.load(mainMenu, _this);
                }, function (error) {
                    noty.error(error.responseJSON.error);
                });

            });
        };

        function attachAddPostHandler(container) {
            var _this = this;
            container.on('click', '#submit-post', function () {
                var postTitle = $('#post-title').val().trim();
                var postBody = $('#post-body').val().trim();
                var postTags = $('#post-tags').data('tags');
                var postId;

                addPostView.loading(container);
                _this.model.posts.addPost(postTitle, postBody).then(
                    function (data) {
                        postId = data.objectId;
                        return _this.model.tags.addTags(postTags);
                    })
                    .then(function (tagsIds) {
                        return _this.model.tagsPosts.addTagsPosts(tagsIds, postId);
                    })
                    .then(
                    function () {
                        window.location.hash = '/view-post/' + postId;

                    },function (error) {
                        console.log(error);
                    }
                ).done();
                loadArchivePanel.call(_this);
                loadMostFamousTags.call(_this);
            });
        };

        function attachAddCommentHandler(container) {
            var _this = this;
            container.on('click', '#submit-comment', function (ev) {
                var commentContent = $('#comment-content').val();
                var postId = $('#post-container').data('id');
                var authorId = credentials.getUserId();
                if (_this.isLogged()) {
                    if (commentContent) {
                        _this.model.comments.add(commentContent, postId, authorId)
                            .then(function (data) {
                                var newComment = {
                                    results: [{
                                        "author": {
                                            "objectId": authorId,

                                            "username": credentials.getUsername()
                                        },
                                        "content": commentContent,
                                        "createdAt": data.createdAt,
                                        "objectId": data.objectId
                                    }]
                                }
                                commentsView.appendComment(_this, commentsContainerSelector, newComment);
                            });
                    } else {
                        noty.error('You can`t post empty comment!');
                    }
                } else {
                    noty.error('Login to comment!');
                }
            });
        };

        function attachEditCommentHandler(container) {
            var _this = this;
            container.on('click', ".comment-edit-btn", function () {
                var commentContainer = $(this).parent();
                commentsView.loadEditForm(_this, commentContainer);
            });
        }

        function attachDeleteCommentHandler(container) {
            var _this = this;
            container.on('click', ".comment-delete-btn", function () {
                var commentContainer = $(this).parent();
                commentsView.deleteComment(_this, commentContainer);
            });
        }

        return {
            load: function (model) {
                return new Controller(model);
            }
        }
    });