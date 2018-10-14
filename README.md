# nodebattleapi

API : Battle API

Author : Sagar Bapardekar

Version : 1.0.0.1

API endpoints

1.api/battle/count

2.api/battle/list

3.api/battle/stats

4.api/battle/search

  -query params king,location,type

Note: Above mentioned endpoints are protected by bearer token authentication. Use below endpoints to acquire access token.

--------------------------------------------------------------------------------------------------------------------------
Additional endpoints for authentication

1.Register user

route : api/user/register

method : post

request body :
{
	"userName": "your user name",
	"password":"your password",
	"email":"your email id"
}

response body :
{
    "status": "success",
    "result": {
        "token": "your api access token"
        "userName": "your user name"
    },
    "error": null,
    "date": "2018-10-14T15:03:59.226Z"
}

2.Login

route : api/user/login

method : post

request body :
{
	"userName": "your user name",
	"password":"your password"
}

response body :
{
    "status": "success",
    "result": {
        "token": "your api access token"
        "userName": "your user name"
    },
    "error": null,
    "date": "2018-10-14T15:03:59.226Z"
}
