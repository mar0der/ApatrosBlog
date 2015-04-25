define(['notifications', 'ajaxRequesterModel', 'commentModel', 'Q', 'credentialsModel'],
   function (noty, Requester, commentModel, Q, credentials) {
       function CommentsRepo(baseUrl) {
           this._serviceUrl = baseUrl + 'classes/Comment/';
           this.commentsRepo = {
               comments: []
           };
       }

       CommentsRepo.prototype.add = function add(content, postId, authorId) {
           var data = {
               "content": content,
               "author": {
                   "__type": "Pointer",
                   "className": "_User",
                   "objectId": authorId
               },
               "post": {
                   "__type": "Pointer",
                   "className": "Post",
                   "objectId": postId
               },
               "ACL": {
                   "*": { "read": true },
                   "role:admin": { "write": true }
               }
           }
           data["ACL"][authorId] = { "write": true, "read": true };
           return Requester.post(this._serviceUrl, credentials.getHeaders(), data);
       }

       CommentsRepo.prototype.update = function updateComment(content, commentId) {
           var data = {
               "content": content
           }

           return Requester.put(this._serviceUrl + commentId, credentials.getHeaders(), data);
       }

       CommentsRepo.prototype.getByPostId = function (postId) {
           var url = this._serviceUrl + '?where={"post": { "__type": "Pointer", "className": "Post", "objectId": "' + postId + '" }}&include=author&order=createdAt';
           return Requester.get(url, credentials.getHeaders());
       };

       return {
           load: function (baseUrl) {
               return new CommentsRepo(baseUrl);
           }
       }
   });