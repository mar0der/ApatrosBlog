define(['mustache'], function (Mustache) {
    function postView(selector, data) {
        $.get('templates/post.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }
    return {
        load: function (selector, data) {
            postView(selector, data);
        }
    }
});