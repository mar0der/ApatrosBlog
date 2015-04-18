define(['mustache'], function (Mustache) {
    function postView(selector, data) {
        $.get('templates/books.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (container, data) {
            postView(container, data);
        }
    }
});