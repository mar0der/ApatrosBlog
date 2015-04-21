define(['ajaxRequesterModel', 'postModel', 'Q', 'credentialsModel', 'noty'], function (Requester, userModel, Q, credentials, noty) {
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
        // TODO Will implement when required

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

    UsersRepo.prototype.assignRole = function (userInfo) {

        alert(1);
        console.log(userInfo);

        var deffer = Q.defer();
        var userId = userInfo['objectId'];
        var headers = credentials.getHeaders();
        headers['X-Parse-Master-Key'] = 'AYHqrzBjPK0HChcSGosMOmIwjVR3YI78We60hY1X';

        var data = {
            "users": {
                "__op": "AddRelation",
                "objects": [
                    {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": userId
                    }
                ]
            }
        };

        Requester.put(this.baseUrl + 'roles/poOqnRXGE3', headers, data)
            .then(function (response) {
                deffer.resolve(response);
            }, function (error) {
                deffer.reject(error);
            });
        return deffer.promise;

    };

    UsersRepo.prototype.editUser = function () {
        // TODO Will implement when required
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