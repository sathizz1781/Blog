git clone https://github.com/sathizz1781/Blog/new/master
cd your-repository
npm install
npm start

Process flow
//USER MODULE
http://localhost:5000/api/signup/register(user register)
    Description
       Creates a user profile for the blog page with necessary fields
    Required fields 
      *firstName(type-string-[Sathish])
      *lastName(type-string-[kumar])
      *userName(type-string-[Sk1781@1])
      *email(type-string-[sathizzkumarrgmail.com])
      *password(type-string-[Sk1781@1])
      *confirmPassword(type-string-[Sk1781@1])
      *gender(type-string-[male])
      *dob(type-string-[2024-04-24])
    Request
        {
          "firstName":"Sathish",
          "lastName":"kumar ",
          "userName":"sk17812",
          "password":"Sk1781@1",
          "confirmPassword":"Sk1781@1",
          "dob":"2000-10-10",
          "email":"sathizzkumarr1@gmail.com",
          "bio":"Node Js Developer",
          "gender":"male",
          "avatar":{
            "type":"png",
            "file":"base64_file",
            "size":"60"
          }
        }
    Response
      1. If there is any error in required inputs (error from validation)
      {
        "statusCode": 403,
        "status": false,
        "message": "Validation fail",
        "result": {},
        "error": {
          "password": "Please enter min 8 & Max 16 digit alphanumeric password"
        }
        }
        
        2. Success message 
        {
          "statusCode": 200,
          "status": true,
          "message": "Inserted Successfully !!!",
          "result": {
            "firstName": "Sathish",
            "lastName": "kumar",
            "userName": "sk17812",
            "password": "$2b$10$0AtOieUM9q7HlcRED218G.gFhG1S0MhIKqseHJhUdifUPZWo1eIPG",
            "email": "sathizzkumarr1@gmail.com",
            "gender": "male",
            "dob": "2000-10-10T00:00:00.000Z",
            "age": 23,
            "avatar": "./uploads/user/profile_sk17812.png",
            "bio": "Node Js Developer",
            "lastLogin": null,
            "token": "",
            "updatedDate": null,
            "_id": "6628a0a8d9e19f35d87663a8",
            "createdDate": "2024-04-24T06:03:20.308Z"
          },
          "error": {}
        }
        
------------------------------------------------------------------------------http://localhost:5000/api/login/login (user login -created JWT token based on payload)
    Description
       Signing in with registered credentials userName and password and then creates JWT for further operations 
    Required 
    *userName(type-string[sk17812]),
    *password(type-string[Sk1781@1])

    Request
       {
          "userName": "rjyogi",
          "password": "Rjyogi88@"
      }
    Response
    1. Error response
    {
      "statusCode": 404,
      "status": false,
      "message": "Password incorrect",
      "result": {},
      "error": {}
    }
    
    2.Success Response
    {
      "statusCode": 200,
      "status": true,
      "message": "Login Successfully !!!",
      "result": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjI3M2VkZDEyMTQ3MTBlMzE0M2YwNzAiLCJlbWFpbCI6InJqeW9nZXNod2FyYW5AZ21haWwuY29tIiwidXNlck5hbWUiOiJyanlvZ2kiLCJpYXQiOjE3MTM5MzkzMTAsImV4cCI6MTcxNDAyNTcxMH0.VEPR9ikai7WHD4bqxgKmKNBnvSzbQ2epDOh1XzaRzkM",
      "error": {}
    }
    
-------------------------------------------------------------------------http://localhost:5000/api/user/view (profile view)
     Description
        Helps in viewing the profile 
     Required
       * email(type-string[sathiv@gmail.com])

    Request
      {
        "email":"sathiv@gmail.com"
      }
-------------------------------------------------------------------------http://localhost:5000/api/user/update (changes can be done except userName,password,email)
    Description
       Updating user profile other than userName, password, email 
     Request
        {
          "firstName":"  Yogesh   ",
          "lastName":"waran",
          "dob":"2000-08-08",
          "bio":"'Im a node js devloper too",
          "gender":"male",
          "avatar":{
            "type":"png",
            "file":"b",
            "size":"60"
          }
      }
--------------------------------------------------------------------------http://localhost:5000/api/user/delete
   Description
      Deleting the user progile completely from DB
    Required
       * email(type-string[sathiv@gmail.com])

    Request
        {
          "email":"sathiv@gmail.com"
        }


//POST MODULE
------------------------------------------------------------------------------http://localhost:5000/api/post/add (create post)
    Description
        Creates a post with title , content, image 
    Required
        * headline(type-string[post title])

    Request
        {
          "headline":"New blog post 23/4 16.59pm",
          "paragraph":"Trial post description 3",
          "image":{
            "type":"png",
            "size":"5000",
            "file":"mmnnhhjj"
          }
-------------------------------------------------------------------------------http://localhost:5000/api/post/view (read post)  --Pagination 
     Description
         Viewing all the post supports pagination
    
    Request
       {
      "page":2,
      "limit":"10",
      "sort":-1
    }
-----------------------------------------------------------------------------------http://localhost:5000/api/post/update (update post)
    Description
       Post updation can be done with changing the headline,content,image if needed.
    Request
      {
        "postId": "662565d11139b6dbd6a38026",
        "headline":"Updated post 2."
      }
      Required
         * postId(type-string[662565d11139b6dbd6a38026])

----------------------------------------------------------------------------------- http://localhost:5000/api/post/delete (delete post)
    Description 
       Delets the post along with the comments associated with it(self and others).
     Request
        {
          "postId": "662565d11139b6dbd6a38026"
      }
    Required
      *postId(type-string[662565d11139b6dbd6a38026])
      
//COMMENT MODULE
-----------------------------------------------------------------------------------http://localhost:5000/api/comment/add ( create comment) 
   Description
     Creates comment 
  Request
     {
      "postId":"662565d11139b6dbd6a38026",
      "comment":"Good"
    }
  Required
    *postId(type-string[662565d11139b6dbd6a38026])
    *comment((type-string[comment line])
-----------------------------------------------------------------------------------http://localhost:5000/api/comment/view ( view comment)
    Description
       View all the comments associated to the post
    Request
        {
          "postId": "662565d11139b6dbd6a38026"
      }
    Required
       *postId(type-string[662565d11139b6dbd6a38026])
-----------------------------------------------------------------------------------http://localhost:5000/api/comment/edit (update comment)
    Description
        Updating the comments 
    Request
       {
          "commentId": "6625869620e3f89b17fb6dcf",
          "comment":"Updated comment."
      }
    Required
        *commentId(type-string[662565d11139b6dbd6a38026]),
        *comment(type-string[any update comment])
-----------------------------------------------------------------------------------http://localhost:5000/api/comment/delete (delete comment)
    Description
        Deleting the single comment done by the user
    Request
         {
            "commentId": "662565d11139b6dbd6a38026"
        }
    Required
        *commentId(type-string[662565d11139b6dbd6a38026])
