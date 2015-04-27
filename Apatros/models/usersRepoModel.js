define(['ajaxRequesterModel', 'postModel', 'Q', 'credentialsModel', 'config'], function (Requester, userModel, Q, credentials, config) {
    function UsersRepo(baseUrl) {
        this.baseUrl = baseUrl;
        this.usersRepo = {
            users: []
        };
    }

    UsersRepo.prototype.getUsers = function () {
        var deffer = Q.defer();
        var _this = this;
        this.usersRepo.users.length = 0;

        Requester.get(this.baseUrl + 'users', credentials.getHeaders()).then(
            function (data) {
                data['results'].forEach(function (result) {
                    var user = new userModel(
                        result['objectId'],
                        result['username'],
                        result['password'],
                        result['firstName'],
                        result['lastName']
                    );
                    _this.usersRepo.users.push(user);
                });
                deffer.resolve(_this.usersRepo);
            }
        );
        return deffer.promise;
    };

    UsersRepo.prototype.getUser = function (id) {
        var deffer = Q.defer();
        Requester.get(this.baseUrl + 'users/' + id, credentials.getHeaders())
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;
    };

    UsersRepo.prototype.addUser = function (data) {
        var deffer = Q.defer();

        Requester.post(this.baseUrl + 'users', credentials.getHeaders(), data)
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;
    };

    UsersRepo.prototype.assignRole = function () {

        
        var deffer = Q.defer();
        var data = {
            "users": {
                "__op": "AddRelation",
                "objects": [
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": credentials.getUserId()
                }]
            }
        };

        Requester.put(this.baseUrl + 'roles/' + config.usersRoleId, credentials.getHeaders(), data)
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;

    };

    UsersRepo.prototype.loginUser = function (data) {
        var deffer = Q.defer();
        var username = data['username'];
        var password = data['password'];
        var loginUrl = '?username=' + username + '&password=' + password;

        Requester.get(this.baseUrl + 'login/' + loginUrl, credentials.getHeaders())
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;
    };

    UsersRepo.prototype.logoutUser = function () {
        var deffer = Q.defer();

        var headers = credentials.getHeaders();
        headers['X-Parse-Session-Token'] = credentials.getSessionToken();

        Requester.post(this.baseUrl + 'logout', headers)
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;
    };

    UsersRepo.prototype.editUser = function (id, user) {
        var deffer = Q.defer(),
            data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };

        Requester.put(this.baseUrl + 'users/' + id, credentials.getHeaders(), data)
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;
    };
    UsersRepo.prototype.deleteUser = function () {
        // TODO Will implement when required
    };

    return {
        load: function (baseUrl) {
            return new UsersRepo(baseUrl);
        }
    }
});