define(['mustache'], function (Mustache) {
    function updateMenu(selector, controller) {
        $.get('templates/menu.html', function (template) {
            var data = {
                isLogged: controller.isLogged(),
                isAdmin: controller.isAdmin()
            };
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }
    return {
        load: function (selector, controller) {
            updateMenu(selector, controller);
        }
    }
});