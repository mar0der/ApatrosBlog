define(['sammy'], function (Sammy) {

    return (function () {

        function User(userName, password, email, firstName, lastName) {
            this.username = userName;
            this.password = password;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
        }

        var newUserName,

            newPassword_1,
            newPassword_2,
            passwordsMatch, // boolean
            passwordsMatchError,

            newEmail,
            validEmail, // boolean
            emailValidationError,

            newFirstName,
            newLastName,

            submitRegistrationButton,
            registrationError;

        submitRegistrationButton = $('#submit-registration');

        passwordsMatchError = $('#password-match-error').text('Please match passwords');
        emailValidationError = $('#email-validation-error').text('Please enter valid email');
        registrationError = $('#registration-error').text('Please fill all fields marked with *');

        $('#registration-form').ready(function () {

            $('#register-user-name,' +
            ' #register-password,' +
            ' #repeat-password,' +
            ' #register-email, ' +
            '#register-first-name, ' +
            '#register-last-name').keyup(validateRegistrationInfo);
        });

        function validateRegistrationInfo() {

            newUserName = $('#register-user-name').val();
            newPassword_1 = $('#register-password').val();
            newPassword_2 = $('#repeat-password').val();
            newEmail = $('#register-email').val();
            newFirstName = $('#register-first-name').val();
            newLastName = $('#register-last-name').val();

            passwordsMatch = validatePasswordMatch(newPassword_1, newPassword_2);
            validEmail = validateEmail(newEmail);

            // Check if passwords match and email is valid. Display message if not and disable submit button.
            if (passwordsMatch && validEmail) {
                $(passwordsMatchError).hide();
                $(emailValidationError).hide();
                $(submitRegistrationButton).prop('disabled', false);

                // only passwords match
            } else if (passwordsMatch) {
                $(passwordsMatchError).hide();
                $(emailValidationError).show().text('Please enter valid email');
                $(submitRegistrationButton).prop('disabled', true);

                // only email is valid
            } else if (validEmail) {
                $(emailValidationError).hide();
                $(passwordsMatchError).show().text('Please match passwords');
                $(submitRegistrationButton).prop('disabled', true);

                // neither passwords match nor email is valid
            } else {
                $(emailValidationError).show().text('Please enter valid email');
                $(passwordsMatchError).show().text('Please match passwords');
            }

            // Check if all fields are filled and pass validation. Display message if not and disable submit button.
            if (newUserName.length > 0 &&
                newPassword_1.length > 0 &&
                newPassword_2.length > 0 &&
                newEmail.length > 0 &&
                newFirstName.length > 0 &&
                newLastName.length > 0) {

                $(registrationError).hide();
            } else {
                $(registrationError).show().text('Please fill all fields marked with *');
                $(submitRegistrationButton).prop('disabled', true);
            }
        }

        function validatePasswordMatch(password, passwordToMatch) {

            if (password && passwordToMatch && password === passwordToMatch) {
                return true;
            }
        }

        function validateEmail(email) {
            var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (emailPattern.test(email)) {
                return true;
            }
        }

        $(submitRegistrationButton).on('click', function () {
            var newUser = new User(newUserName, newPassword_1, newEmail, newFirstName, newLastName);
            submitRegistration(newUser);
        });

        function submitRegistration(user) {

            $.ajax({
                url: 'https://api.parse.com/1/users',
                method: 'POST',
                headers: {
                    // Apatros Blog
                    'X-Parse-Application-Id': 'sAlqoFcliaMOPu1infSGzfa406gUmHzrge8b8L7f',
                    'X-Parse-REST-API-Key': 'ZQqvH9UyASPOOTY59PlUMgPaJ5v5sqPKbcbbuMBN',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(user),
                success: function (data) {

                    // TODO:
                    // 1. Parse session token
                    // 2. Send logout request with session token and logout user
                    // 3. Redirect to login page
                    // 4. Uppon login check if email is verified
                    // 5. If yes - send request and assign "role" to user. Proceed to blog
                    // 6. If not - display message and logout user

                    // FOR TESTING PURPOSES
                    console.log(data);
                },
                error: function (err) {
                    var errorMessage = JSON.parse(err['responseText'])['error'];
                    errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) + '.';
                    alert(errorMessage);
                }
            });
        }
    }());
});