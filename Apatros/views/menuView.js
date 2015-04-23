define(['mustache'], function (Mustache) {
    function updateMenu(selector, data) {
        $.get('templates/menu.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }
    return {
        load: function (selector, data) {
            updateMenu(selector, data);
        }
    }
});