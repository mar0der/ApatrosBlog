define(['mustache'], function (Mustache) {
    function tagsView(selector, data) {
        $.get('templates/tags.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            tagsView(selector, data);
        }
    }
});