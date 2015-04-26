define(['notifications', 'postsView', 'postView', 'tagsView', 'profileView',
        'loginView', 'logoutView', 'registerView', 'addPostView',
        'archiveView', 'registrationValidator', 'credentialsModel', 'menuView', 'commentsView',
        'mostFamousTagsView', 'notFoundView'],
    function (noty, postsView, postView, tagsView, profileView,
              loginView, logoutView, registerView, addPostView,
              archiveView, validator, credentials, menuView, commentsView,
              mostFamousTagsView, notFoundView) {

        var leftAside = $('#left'),
            rightAside = $('#right'),
            mainMenu = $('#main-menu');

        function Controller(model) {
            this.model = model;
            this.noty = noty;
            this.credentials = credentials;
        }

        Controller.prototype.init = function (container) {
            this.loadMostFamousTags();
            attachRegisterHandler.call(this, container);
            attachLoginHandler.call(this, container);
            attachLogoutHandler.call(this, container);
            attachAddPostHandler.call(this, container);
            attachAddCommentHandler.call(this, container);
            attachEditCommentHandler.call(this, container);
            attachDeleteCommentHandler.call(this, container);
            menuView.load(mainMenu, this);
            this.loadMostFamousTags();
            this.loadArchivePanel();
        };
        //load pages

        Controller.prototype.isLogged = function isLogged() {
            if (sessionStorage['sessionToken']) {
                return true;
            }
            return false;
        }

        Controller.prototype.isAdmin = function isAdmin() {
            if (credentials.getUserRole() === '8QLZGmzWmP') {
                return true;
            }
            return false;
        }

        Controller.prototype.loadPosts = function (container) {
            postsView.loading(container);
            this.model.posts.getPosts('&limit=5').then(
                function (data) {
                    postsView.load(container, data);
                }
            );
        };
        Controller.prototype.loadArchivePanel = function () {
            this.model.posts.getPostsDates().then(
                function (data) {
                    archiveView.load(leftAside, filterArchives(data));
                }
            );
        };

        Controller.prototype.loadMostFamousTags = function loadMostFamousTags() {
            this.model.tagsPosts.getMostFamousTags(20).then(
                function (data) {
                    mostFamousTagsView.load(rightAside, data);
                },
                function (error) {
                    console.log(error.responseText);
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

        Controller.prototype.loadPost = function (container, id) {
            var _this = this;
            this.model.posts.getPost(id).then(
                function (post) {
                    postView.load(container, post);
                    return _this.model.comments.getByPostId(id);
                }).then(function (data) {
                    commentsView.load(_this, '#comments-container', data);
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
            //TODO: Load Tags logic
            tagsView.load(container);
        };

        Controller.prototype.loadProfile = function (container) {
            this.model.users.getUser(sessionStorage['userId']).then(function (user) {
                profileView.load(container, user);
            });
        };

        Controller.prototype.loadLogin = function (container) {
            
            if (this.isLogged()) {
                window.location.hash = '/posts';
            } else {
                loginView.load(this, container);
            }
        };

        Controller.prototype.loadLogout = function (container) {
            logoutView.load(container);
            //TODO: Login Logic
        };

        Controller.prototype.loadRegister = function (container) {
            if (this.isLogged()) {
                window.location.hash = '/posts';
            } else {
                registerView.load(container);
            }
        };

        Controller.prototype.loadAddPost = function (container) {
            //TODO: Add Post Logic
            addPostView.load(container);
        };

        Controller.prototype.loadNotFound = function loadNotFound(container, url) {
            notFoundView.load(container, url);
        }

        //Event Handlers
        function attachRegisterHandler(container) {
            var _this = this;

            // Attach keyup to validate the fields of the registration form
            var inputFields = $('#registration-form  > fieldset > input');

            container.on('keyup', inputFields, function (event) {
                var target = event.target;
                var submitButton = $('#submit-registration');

                validator.validateInput(target);

                if (document.getElementsByClassName('passed').length === 6) {
                    submitButton.prop('disabled', false);
                } else {
                    submitButton.prop('disabled', true);
                }
            });

            // Attach click to submit registration
            container.on('click', '#submit-registration', function (ev) {
                var registrationInfo = parseRegistrationInfo();
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
                            $('#noty-container').html('');
                            noty.success('You have successfully registered!');
                            menuView.load(mainMenu, _this);
                            window.location.hash = '/posts?hidenoty=true';
                        });
                    }, function (error) {
                        noty.error(error.responseJSON.error);
                    });
            });
            // WHERE SHOULD I PUT THIS ?
            function parseRegistrationInfo() {
                var newUserName,
                    newPassword_1,
                    newPassword_2,
                    newEmail,
                    newFirstName,
                    newLastName,
                    registrationInfo = [];

                newUserName = $('#register-user-name').val();
                newPassword_1 = $('#register-password').val();
                newPassword_2 = $('#repeat-password').val();
                newEmail = $('#register-email').val();
                newFirstName = $('#register-first-name').val();
                newLastName = $('#register-last-name').val();

                registrationInfo.push(newUserName, newPassword_1, newPassword_2, newEmail, newFirstName, newLastName);

                return registrationInfo;
            }
        };

        function attachLoginHandler(container) {
            var _this = this;
            container.on('click', '#submit-login', function (ev) {
                var username = $('#username').val();
                var password = $('#password').val();
                var user = {
                    username: username,
                    password: password
                };
                _this.model.users.loginUser(user)
                   .then(function (data) {
                       credentials.setSessionToken(data['sessionToken']);
                       credentials.setUserId(data['objectId']);
                       credentials.setUsername(data['username']);
                       if (data['role']) {
                           credentials.setUserRole(data['role'].objectId);
                       }
                       _this.model.users.getUser(credentials.getUserId())
                           .then(function (data) {
                               var emailVerified = data['emailVerified'];

                               if (!emailVerified) {
                                   noty.info('Please verify your email address');
                               }
                               menuView.load(mainMenu, _this);
                               window.location.hash = '/posts';
                           });
                   }, function (error) {
                       noty.error(error.responseJSON.error);
                   });
            });
        };

        function attachLogoutHandler(container) {
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
            container.on('click', '#submit-post', function (ev) {
                var postTitle = $('#post-title').val().trim();
                var postBody = $('#post-body').val().trim();
                var postTags = $('#post-tags').data('tags');
                var postId;
                
                addPostView.loading(container);
                _this.model.posts.addPost(postTitle, postBody).then(
                    function (data) {
                        postId = data.objectId;
                        return _this.model.tags.addTags(postTags);
                    }).then(function (tagsIds) {
                        console.log('vikago');
                        return _this.model.tagsPosts.addTagsPosts(tagsIds, postId);
                    }).then(
                    function () {
                        window.location.hash = '/view-post/' + postId;

                    },
                    function (error) {
                        console.log(error);
                    }
                ).done();
                _this.loadArchivePanel();
            });
        };

        function attachAddCommentHandler(container) {
            var _this = this;
            container.on('click', '#submit-comment', function (ev) {
                var commentContent = $('#comment-content').val();
                var postId = $('#post-container').data('id');
                var authorId = credentials.getUserId();
                if (authorId) {
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
                                commentsView.appendComment(_this, '#comments-container', newComment);
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
            container.on('click', "#edit-comment", function (ev) {
                var commentContainer = $(this).parent().parent();
                commentsView.loadEditForm(_this, commentContainer);
            });
        }

        function attachDeleteCommentHandler(container) {
            var _this = this;
            container.on('click', "#delete-comment", function (ev) {
                var commentContainer = $(this).parent().parent().parent();
                commentsView.deleteComment(_this, commentContainer);
            });
        }
        return {
            load: function (model) {
                return new Controller(model);
            }
        }
    });