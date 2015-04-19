define(['mustache'], function (Mustache) {
    function addPostView(selector, data) {
        $.get('templates/addPost.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            addPostView(selector, data);
        }
    }
});