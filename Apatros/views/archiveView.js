define(['mustache'], function (Mustache) {
    function archiveView(selector, data) {
        $.get('templates/archives.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            archiveView(selector, data);
        }
    }
});