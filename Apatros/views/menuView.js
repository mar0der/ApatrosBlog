define(['mustache'], function (Mustache) {
    function updateMenu(selector) {
        $.get('templates/menu.html', function(template) {
            var data = {
                logged:false
            };
            if(sessionStorage.sessionToken){
                data.logged = true;
            }
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