## messaeg object
```javascript
{
    success: , // boolean
    msg: , // string
}
```

---

### register
POST /register

```javascript
{
    account: '', // string
    password: '' // string
}
```
return messaeg object
msg is token

---
### login
POST /login

```javascript
{
    account: '', // string
    password: '' // string
}
```
return messaeg object

---

### get
GET /posts
return recently posts
---

POST /post

require token

```javascript
{
    title: '', //string
    content: '', //string
    created_time: '', //date
    token: '', //string
}
```
return message object

---
GET /post?id='post_id'
return post

---
DELETE /post?id='post_id'
return message object

---
 PUT /post
 ```javascript
{
    title: '', // string
    id: '', // string
    token: '' // string
}
 ```
return message object

---

### comment
POST /comment

```javascript
{
    content: '', // string
    post_id: '', // string
    created_time: '' // date
    token: '' // string
}
```

return message object

---

PUT /comment
```javascript
{
    id: '', // string
    content: '', // string
    token: '' // string
}
```

return message object

---
DELETE /comment?id='comment_id'
return message object

---
GET /comment?id='comment_id'
return post_id

---

GET /history
return message object
msg field with array of post and comment histories 

```javascript
{
    "success": true,
    "msg": [
        {
            "user_id": "e2eb6d98-c535-4deb-babf-40e6ae45d595",
            "post_id": "869ebe5c-87e7-4898-a674-708a601309ce",
            "preference_type": "creator",
            "type": "post"
        }
    ]
}
```













