define([], function () {
    function User(id, username, password, firstName, lastName) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    return User;
});