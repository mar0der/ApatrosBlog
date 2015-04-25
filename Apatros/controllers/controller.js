define(['notifications', 'postsView', 'postView', 'tagsView',
        'loginView', 'logoutView', 'registerView', 'addPostView',
        'archiveView', 'registrationValidator', 'credentialsModel', 'menuView', 'commentsView',
        'mostFamousTagsView'],
    function (noty, postsView, postView, tagsView,
              loginView, logoutView, registerView, addPostView,
              archiveView, validator, credentials, menuView, commentsView,
              mostFamousTagsView) {

        var leftAside = $('#left'),
            rightAside = $('#right'),
            mainMenu = $('#main-menu'),
            attachRegisterHandler,
            attachLoginHandler,
            attachAddPostHandler,
            attachAddCommentHandler,
            attachLogoutHandler,
            attachAddPostTagsHandler,
            attachEditCommentHandler,
            attachDeleteCommentHandler,
            attachSeveEditedComment,
            test;

        function Controller(model) {
            this.model = model;
            this.noty = noty;
            this.credentials = credentials;
        }

        Controller.prototype.init = function (container) {
            attachRegisterHandler.call(this, container);
            attachLoginHandler.call(this, container);
            attachLogoutHandler.call(this, container);
            attachAddPostHandler.call(this, container);
            attachAddPostTagsHandler.call(this, container);
            attachAddCommentHandler.call(this, container);
            attachEditCommentHandler.call(this, container);
            attachDeleteCommentHandler.call(this, container);
            menuView.load.call(this, mainMenu);
            test.call(this, container);
            this.loadMostFamousTags();
            this.loadArchivePanel();
        };

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
            var _this = this;
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
                function(data) {
                    mostFamousTagsView.load(rightAside, data);
                },
                function(error) {
                    console.log(error.responseText);
                }
            );
        };

        Controller.prototype.loadArchiveByPeriod = function (container, date) {
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
                       if (data['role']) {
                           credentials.setUserRole(data['role'].objectId);
                       }
                       

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

        function attachAddPostTagsHandler(container) {
            var catchedTags = [];
            var catchedTagsSpans = [];
            var input;
            var isEmptyField = true;
            $(window).on('hashchange', function () {
                catchedTags = [];
                catchedTagsSpans = [];
                if (input) {
                    input.data('tags', []);
                }
            });
            container.on('click', '#tags-wrapper', function () {
                $(this).children('input').focus();
            });
            container.on('blur', '#post-tags', function () {
                addTag($(this).val());
                $(this).val('');
            });
            container.on('keyup', '#post-tags', function (event) {
                input = $(this);
                var value = input.val();
                var _this = this;
                var tagsContainer = $('.tags');
                var tags = value.split(',');
                var backSpaceCode = 8;
                if (event.keyCode == backSpaceCode && isEmptyField) {
                    var lastTagIndex = _.findLastIndex(catchedTags);
                    deleteTagByIndex(lastTagIndex, true);
                }

                if (!input.val().length) {
                    isEmptyField = true;
                } else {
                    isEmptyField = false;
                }
                if (tags.length > 1) {
                    tags.forEach(function (tag) {
                        addTag(tag);
                    });
                    $(this).val('');
                    isEmptyField = true;
                }
                input.data('tags', catchedTags);
            });

            function addTag(tag) {
                tag = tag.trim().toLowerCase();
                if (tag.length && !_.includes(catchedTags, tag)) {
                    var tagSpan = $('<span class="tag" title="' + tag + '">' + tag + '<span class="deleteTag" data-index="' + catchedTags.length + '">x</span></span>');
                    catchedTags.push(tag);
                    catchedTagsSpans.push({
                        tagName: tag,
                        tagSpan: tagSpan
                    });
                    input.before(tagSpan);
                }
            }
            function deleteTagByIndex(index, backSpace) {
                if (catchedTags.length > 0) {
                    if (backSpace) {
                        input.val(catchedTags[index]);
                    }
                    catchedTagsSpans.forEach(function (row) {
                        if (row.tagName == catchedTags[index]) {
                            row.tagSpan.remove();
                            delete row;
                        }
                    });
                    delete catchedTags[index];
                    input.data('tags', catchedTags);
                }
            }
            container.on('click', '.deleteTag', function () {
                var tagIndex = $(this).data('index');
                deleteTagByIndex(tagIndex);
            });
        };
        attachAddPostHandler = function attachAddPostHandler(container) {
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

        attachAddCommentHandler = function attachAddCommentHandler(container) {
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

        attachEditCommentHandler = function attachEditCommentHandler(container) {
            var _this = this;
            container.on('click', "#edit-comment", function (ev) {
                var commentContainer = $(this).parent().parent();
                commentsView.loadEditForm(_this, commentContainer);
            });
        }

        attachDeleteCommentHandler = function attachDeleteCommentHandler(container) {

        }

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