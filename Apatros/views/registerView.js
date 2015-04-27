define(['mustache', 'registrationValidator'], function (Mustache, validator) {
    function registerView(controller, selector, data) {
        $.get('templates/register.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
            registerHandler(controller, $(selector));
        });
    }

    function registerHandler(controller, container) {
        // Attach keyup to validate the fields of the registration form
        var inputFields = $('#registration-form input');

        container.on('keyup', inputFields, function (event) {
            var target = event.target;
            var submitButton = $('#submit-registration');

            validator.validateInput(target);

            var numberOfValidFields = 6;
            if (document.getElementsByClassName('passed').length === numberOfValidFields) {
                submitButton.prop('disabled', false);
            } else {
                submitButton.prop('disabled', true);
            }
        });
    }

    function parseRegistrationInfo() {
        var newUserName,
            newPassword_1,
            newPassword_2,
            newEmail,
            newFirstName,
            newLastName,
            registrationInfo = [];

        newUserName = $('#register-user-name').val().trim();
        newPassword_1 = $('#register-password').val();
        newPassword_2 = $('#repeat-password').val();
        newEmail = $('#register-email').val().trim();
        newFirstName = $('#register-first-name').val().trim();
        newLastName = $('#register-last-name').val().trim();

        registrationInfo.push(newUserName, newPassword_1, newPassword_2, newEmail, newFirstName, newLastName);

        console.log(registrationInfo);

        return registrationInfo;
    }

    return {
        load: function (controller, selector, data) {
            registerView(controller, selector, data);
        },
        parseRegistrationInfo: parseRegistrationInfo
    }
});