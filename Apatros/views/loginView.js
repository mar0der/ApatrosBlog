define(['mustache'], function (Mustache) {
    function loginView(controller, selector, data) {
        $.get('templates/login.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }
    return {
        load: function (controller, selector, data) {
            loginView(controller, selector, data);
        }
    }
});