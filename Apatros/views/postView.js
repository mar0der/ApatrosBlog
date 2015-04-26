define(['mustache'], function (Mustache) {
    function postView(container, data) {
        $.get('templates/post.html', function (template) {
            var output = Mustache.render(template, data);
            container.html(output);
        });
    }
    return {
        load: function (selector, data) {
            postView(selector, data);
        }
    }
});