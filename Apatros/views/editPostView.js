define(['mustache'], function (Mustache) {
    function editPostView(selector, data) {
        $.get('templates/editPost.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            editPostView(selector, data);
        }
    }
});