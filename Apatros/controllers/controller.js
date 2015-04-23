define(['notifications', 'postsView', 'postView', 'tagsView',
        'loginView', 'logoutView', 'registerView', 'addPostView',
        'archiveView', 'registrationValidator', 'credentialsModel', 'menuView'],
    function (noty, postsView, postView, tagsView,
              loginView, logoutView, registerView, addPostView,
              archiveView, validator, credentials, menuView) {

        var attachRegisterHandler,
            attachLoginHandler,
            attachAddPostHandler,
            attachAddCommentHandler,
            attachLogoutHandler,
            test;

        function Controller(model) {
            this.model = model;
        }

        Controller.prototype.init = function (container) {
            attachRegisterHandler.call(this, container);
            attachLoginHandler.call(this, container);
            attachLogoutHandler.call(this, container);
            attachAddPostHandler.call(this, container);
            attachAddCommentHandler.call(this, container);
            test.call(this, container);
        };
        Controller.prototype.loadPosts = function (container, leftAside) {
            this.model.posts.getPosts().then(
                function (data) {
                    postsView.load(container, data);
                    archiveView.load(leftAside, filterArchives(data));
                }
            );
        };

        Controller.prototype.loadArchive = function (container, leftAside, date) {
            this.model.posts.getPostsByDate(date).then(
                function (data) {
                    postsView.load(container, data);
                }
            );
        };

        function filterArchives(data) {
            var uniqueDates = [],
                uniqueObjects = { dates: [] };

            for (var post in data.posts) {
                var d = data.posts[post].date;
                if (uniqueDates.indexOf(d) < 0) {
                    uniqueDates.push(d);
                    uniqueObjects.dates.push({ date: d });
                }
            }
            return uniqueObjects;
        }

        Controller.prototype.loadPost = function (container, id) {
            this.model.posts.getPost(id).then(
                function (post) {
                    postView.load(container, post);
                }
            );
        };

        Controller.prototype.loadTags = function (container) {
            //TODO: Load Tags logic
            tagsView.load(container);
        };

        Controller.prototype.loadLogin = function (container) {
            loginView.load(container);
            //TODO: Login Logic
        };

        Controller.prototype.loadLogout = function (container) {
            logoutView.load(container);
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


        test = function (container) {
            container.on('click', function () {
                ///TODO: delete later
            });
        };

        //Event Handlers
        attachRegisterHandler = function attachRegisterHandler(container) {
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
                            loggedMenu();
                            noty.success('You have successfully registered!');
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

        attachLoginHandler = function attachLoginHandler(container) {
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

                       _this.model.users.getUser(credentials.getUserId())
                           .then(function (data) {
                               var emailVerified = data['emailVerified'];

                               if (!emailVerified) {
                                   noty.info('Please verify your email address');
                               }
                               loggedMenu();
                               window.location.hash = '/posts';
                           });
                   }, function (error) {
                       noty.error(error.responseJSON.error);
                   });
            });
        };

        attachLogoutHandler = function attachLogoutHandler(container) {
            var _this = this;
            $('body').on('click', '#submit-logout', function (ev) {
                _this.model.users.logoutUser()
                .then(function () {
                    sessionStorage.clear();
                        loggedOutMenu();
                    }, function (error) {
                    noty.error(error.responseJSON.error);
                });

            });
        };

        attachAddPostHandler = function attachAddPostHandler(container) {
            var _this = this;
            container.on('click', '#submit-post', function (ev) {
                var postTitle = $('#post-title').val().trim();
                var postBody = $('#post-body').val().trim();
                var postTags = $('#post-tags').val().trim();
                var postId;
                var tagsIds = [];
                addPostView.loading(container);
                _this.model.posts.addPost(postTitle, postBody).then(
                    function (data) {
                        postId = data.objectId;
                        return _this.model.tags.addTags(postTags);
                    }).then(function (data) {
                        data.forEach(function (value) {
                            tagsIds.push(value.success.objectId);
                        });

                        return _this.model.tagsPosts.addTagsPosts(tagsIds, postId);
                    }).then(
                    function () {
                        window.location.hash = '/view-post/' + postId;
                    },
                    function (error) {
                        console.log(error.responseText);
                    }
                );
            });
        };

        attachAddCommentHandler = function attachAddCommentHandler(container) {
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

        function loggedMenu() {
            menuView.load("#main-menu", { 'login': false, 'register': false, 'logout': true });
        }
        function loggedOutMenu() {
            menuView.load("#main-menu", { 'login': true, 'register': true, 'logout': false });
        }
        return {
            load: function (model) {
                return new Controller(model);
            }
        }
    });