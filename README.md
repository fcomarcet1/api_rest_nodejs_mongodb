# api-rest-nodejs-mongodb
# ROUTES 
##AUTH

    -REGISTER: (POST) //localhost:3099/api/auth/register
        -Inputs: [name, surname, email, password]

    -LOGIN: (POST) http://localhost:3099/api/auth/login
        -Inputs: [email, password]
    
    -ACTIVATE ACCOUNT (PATCH) http://localhost:3099/api/auth/activate
        -Inputs: [email, code]

    -RESET CONFIRMATION CODE (PATCH) http://localhost:3099/api/auth/refresh-confirmationCode
         -Inputs: [email]

##USER
    -SHOW: User profile: (GET) http://localhost:3099/api/user/show

    -GET ALL: Users list [ROLE_ADMIN]: (GET) http://localhost:3099/api/user/all

    -EDIT: Fill form edit user (GET) http://localhost:3099/api/user/edit

    -EDIT: Update user account (PUT) http://localhost:3099/api/user/edit
        -Inputs: [name, surname, email]

    -DELETE: Update user account (DELETE) http://localhost:3099/api/user/delete

##TOPICS
    -CREATE NEW TOPIC: (POST) http://localhost:3099/api/topic/create
        -Inputs: [title, content, language, code]

    -GET ALL TOPICS: Topic list [ROLE_ADMIN]: (GET) http://localhost:3099/api/topic/list

    -GET ALL  TOPICS PAGINATE: Topic list : (GET) http://localhost:3099/api/topics/all/page

    -GET TOPIC BY USER: Topic list by user : (GET) http://localhost:3099/api/topics/user/userId

    -TOPIC DETAILS: Topic detail: (GET) http://localhost:3099/api/topic/detail/topicId

    -UPDATE TOPIC: Topic update: (PUT) http://localhost:3099/api/topic/update/topicId
        -Inputs: [title, content, language, code]

    -DELETE TOPIC Topoc delete (DELETE) http://localhost:3099/api/topic/delete/topicId

##COMMENTS
    -CREATE COMMENT: (POST) http://localhost:3099/api/comment/create/topic/:topicId
        -Input: [content]

    -UPDATE COMMENT: (PUT)  http://localhost:3099/api/comment/update/:commentId
        -Input: [content]

    -DELETE COMMENT (DELETE) http://localhost:3099/api/comment/delete/:topicId/:commentId


ADMIN[ROLE_ADMIN]:
-Admin profile: (GET)  http://localhost:3099/api/admin/profile

-All users : (GET) http://localhost:3099/api/admin/users
-User detail: (GET)
-Delete user Account: (DELETE)

USER[ROLE_USER]:
-User profile: (GET) http://localhost:3099/api/user/show
-User edit (GET) http://localhost:3099/api/user/edit
-User update profile: (PUT) http://localhost:3099/api/user/update
-User upload avatar (POST) http://localhost:3099/api/upload/avatar
-Get user avatar (GET) http://localhost:3099/api/user/avatar/:fileName
-Delete user Account: (DELETE) http://localhost:3099/api/user/delete
"# api_rest_nodejs_mongodb_final" 
