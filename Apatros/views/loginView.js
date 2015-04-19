define(['mustache'], function (Mustache) {
    function loginView(selector, data) {
        $.get('templates/login.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            loginView(selector, data);
        }
    }
});