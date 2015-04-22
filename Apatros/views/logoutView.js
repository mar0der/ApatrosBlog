define(['mustache'], function (Mustache) {
    function logoutView(selector, data) {
        $.get('templates/logout.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            logoutView(selector, data);
        }
    }
});