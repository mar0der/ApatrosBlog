define(['mustache'], function (Mustache) {
    function addPostView(selector, url) {
        $.get('templates/notFound.html', function (template) {
            var output = Mustache.render(template, {"url": url.substr(2,url.length-1)});
            $(selector).html(output);
        });
    }

    return {
        load: function (selector, data) {
            addPostView(selector, data);
        }
    }
});