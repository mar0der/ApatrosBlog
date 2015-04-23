define( function () {
    function postDateModel(date) {
        this.date =  new Date(date).toDateString();
    }

    return postDateModel;
});