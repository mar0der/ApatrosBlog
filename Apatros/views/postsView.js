define(['mustache'], function (Mustache) {
    function PostsView(selector, data) {
        $.get('templates/posts.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            PostsView(selector, data);
        }
    }
});