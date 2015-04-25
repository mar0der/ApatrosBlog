define(['mustache'], function (Mustache) {
    function profileView(selector, data) {
        $.get('templates/profile.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }
    return {
        load: function (selector, data) {
            profileView(selector, data);
        }
    }
});


