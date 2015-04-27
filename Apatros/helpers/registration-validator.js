define([], function () {
    function validateInput(input) {
        var input,
            inputType;

        input = $(input);
        inputType = $(input).attr('type');

        switch (inputType) {
            case ('password'):
                {
                    if (validInputLength(input)) {
                        var passwordId = input.attr('id');

                        switch (passwordId) {
                            case ('register-password'):
                                {
                                    var password = input.val();
                                    var passwordToMatch = $('#repeat-password');
                                    var passwordMatch = validatePasswordMatch(password, passwordToMatch.val());

                                    if (passwordToMatch && passwordMatch) {
                                        passValidation(input);
                                        passValidation(passwordToMatch);
                                    } else if (passwordToMatch) {
                                        passValidation(input);
                                        failValidation(passwordToMatch);
                                    } else {
                                        failValidation(input);
                                        failValidation(passwordToMatch);
                                    }
                                    break;
                                }

                            case ('repeat-password'):
                                {
                                    var password = input.val();
                                    var passwordToMatch = $('#register-password');
                                    var passwordMatch = validatePasswordMatch(password, passwordToMatch.val());

                                    if (passwordToMatch && passwordMatch) {
                                        passValidation(input);
                                        passValidation(passwordToMatch);
                                    } else {
                                        failValidation(input);
                                    }
                                    break;
                                }
                        }

                    } else {
                        failValidation(input);
                        failValidation($('#repeat-password'));
                    }
                    break;
                }

            case ('email'):
                {
                    if (validInputLength(input)) {
                        if (validEmail(input)) {
                            passValidation(input);
                        }
                        else {
                            failValidation(input);
                        }
                    } else {
                        failValidation(input);
                    }
                    break;
                }

            default:
                if (validInputLength(input)) {
                    passValidation(input);
                } else {
                    failValidation(input);
                }
                break;
        }
    }

    function validInputLength(input) {
        return input.val().trim().length > 0;
    }

    function validatePasswordMatch(password, passwordToMatch) {
        return password && passwordToMatch && password === passwordToMatch;
    }

    function validEmail(email) {
        var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailPattern.test(email.val());
    }

    function passValidation(input) {
//        $('label[for=' + input.attr('id') + '] .validation').addClass('passed').html('&#10004;');
        $('label[for=' + input.attr('id') + '] .validation').attr('class', 'validation passed');
    }

    function failValidation(input) {
//        $('label[for=' + input.attr('id') + '] .validation').removeClass('passed').html('&#10008;');
        $('label[for=' + input.attr('id') + '] .validation').attr('class', 'validation fail');
    }

    return {
        validateInput: validateInput
    };
});