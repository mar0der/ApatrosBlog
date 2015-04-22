define(['postsView', 'postView', 'tagsView',
        'loginView', 'logoutView', 'registerView', 'addPostView',
        'registrationValidator', 'credentialsModel'],
    function (postsView, postView, tagsView,
              loginView, logoutView, registerView, addPostView,
              validator, credentials) {

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
            attachLogoutHandler.call(this, container);
            attachAddPostHandler.call(this, container);
            attachAddCommentHandler.call(this, container);
        };

        Controller.prototype.loadPosts = function (container) {
            this.model.posts.getPosts().then(
                function (data) {
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

        var attachRegisterHandler = function attachRegisterHandler(container) {
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
                    .then(function (data) {

                        alert(2);
                        _this.model.users.assignRole(data);

                    }, function (error) {

                        console.log(JSON.parse(error['responseText'])['error']);

                    });




                // TODO Display successfull signup message
                // TODO Logout user
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

        var attachLoginHandler = function attachLoginHandler(container) {
            var _this = this;
            container.on('click', '#submit-login', function (ev) {
                var username = $('#username').val()
                var password = $('#password').val()
                var user = { username: username, password: password }

                _this.model.users.loginUser(user)
                   .then(function (data) {
                       credentials.setSessionToken(data['sessionToken']);
                       var userId = data['objectId'];                       
                    
                       _this.model.users.getUser(userId)
                           .then(function (data) {
                           console.log(data)
                       });


                       logoutView.load(container);
                   }





                   , function (error) {

                       console.log(JSON.parse(error['responseText'])['error']);

                   });

            });
        };

        var attachLogoutHandler = function attachLogoutHandler(container) {
            var _this = this;
            container.on('click', '#submit-logout', function (ev) {
                _this.model.users.logoutUser()

                   .then(function (data) {
                       loginView.load(container)

                   }, function (error) {

                       console.log(JSON.parse(error['responseText'])['error']);

                   });

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