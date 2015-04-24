define(['mustache'], function (Mustache) {
    function archiveView(container, data) {
        $.get('templates/mostFamousTags.html', function (template) {
            var output = Mustache.render(template, data);
            container.html(output);
        })
    }
    return {
        load: function (container, data) {
            archiveView(container, data);
        }
    }
});