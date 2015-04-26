define(['mustache'], function (Mustache) {
    function profileView(selector, data) {
        $.get('templates/profile.html', function (template) {
            data.createdAt = formatDate(data.createdAt)
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    function formatDate(dateString){
        var date = new Date(dateString);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var formattedDate = addZero(day) + '.' + addZero(month) + '.' + addZero(year) + ' ' + addZero(hours) + ':' + addZero(minutes);

        function addZero(num){
            return num > 9 ? num : '0' + num;
        }

        return formattedDate;
    }

    return {
        load: function (selector, data) {
            profileView(selector, data);
        }
    }
});


