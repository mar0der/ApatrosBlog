define(['mustache'], function (Mustache) {
    function registerView(selector, data) {
        $.get('templates/register.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            registerView(selector, data);
        }
    }
});