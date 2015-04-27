define(['mustache'], function (Mustache) {
    function profileView(controller, selector, data) {
        $.get('templates/profile.html', function (template) {
            data.createdAt = formatDate(data.createdAt);

            if ((data.username === controller.credentials.getUsername())
                && controller.isLogged()) {
                data['allowedToEdit'] = true;
            }

            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    function loadEditProfile(controller, profileDiv) {
        //var userId = profileDiv.attr('id');
        var user = {
            objectId : profileDiv.attr('id'),
            username : $('#username').text(),
            createdAt : $('#registration-date').text(),
            firstName : $('#firstName').text(),
            lastName : $('#lastName').text(),
            email : $('#e-mail').text(),
            allowedToEdit : true
        };

        $.get('templates/editProfileForm.html', function (template) {
            var output = Mustache.render(template, user);
            profileDiv.html(output);
        })
            .then(function () {
                profileDiv.on('click', '.save-edited-profile', function () {
                        user.firstName = $('.edit-firstname-input').val();
                        user.lastName = $('.edit-lastname-input').val();
                        user.email = $('.edit-email-input').val();
                    controller.model.users.editUser(user.objectId, user)
                        .then(function () {
                            $.get('templates/profile.html', function (template) {
                                var output = Mustache.render(template, user);
                                profileDiv.html(output);
                            });
                        }, function (error) {
                            controller.noty.error(error.responseJSON.error);
                            controller.noty.error("You are not allowed to edit this user");
                        });
                });
            });

    }

    function formatDate(dateString){
        var date = new Date(dateString);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var formattedDate = addZero(day) + '.' + addZero(month) + '.' + addZero(year) + ' ' + addZero(hours) + ':' + addZero(minutes);

        function addZero(num){
            return num > 9 ? num : '0' + num;
        }

        return formattedDate;
    }

    return {
        load: function (controller, selector, data) {
            profileView(controller, selector, data);
        },
        loadEditProfile: loadEditProfile
    }
});


