define(['mustache', 'credentialsModel'], function (Mustache, credentials) {
    function updateMenu(selector, controller) {
        $.get('templates/menu.html', function (template) {
            var data = {
                username: credentials.getUsername(),
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