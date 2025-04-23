# Access's logic (login, logout, signup)

## Base URL: &nbsp; `/api/v1/access`

## 1. \[POST] signup

**Method:** &nbsp; `POST /signup`  
**Description:** &nbsp; Đăng ký tài khoản người dùng mới.
**Body:**

```json
{
    "email": "counterstriker@gmail.com",
    "username": "counterstriker",
    "displayname": "Le Duc Nhan",
    "password": "123456",
    "gender": "male"
}
```

**Request:**

```http
POST /api/v1/access/signup
```

**Response:**

```json
{
    "message": "Registered successfully!",
    "statusCode": 201,
    "metadata": {
        "user": {
            "_id": "680496bdebb6f6f9fc3699a3",
            "user_name": "counterstriker",
            "user_email": "counterstriker@gmail.com",
            "user_permission": "user",
            "user_displayname": "Le Duc Nhan"
        },
        "tokens": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA0OTZiZGViYjZmNmY5ZmMzNjk5YTMiLCJpYXQiOjE3NDUxMzExOTcsImV4cCI6MTc0NTMwMzk5N30.fQJsX2z8kOx8OwyxdMWEuZz1Ql7VsPRwowQeBMBRaH4"
    }
}
```

---

## 2. \[POST] login

**Method:** &nbsp; `POST /login`  
**Description:** &nbsp; Đăng nhập tài khoản.
**Body:**

```json
{
    "username": "counterstriker",
    "password": "123456"
}
```

**Request:**

```http
POST /api/v1/access/login
```

**Response:**

```json
{
    "message": "Login successfully!",
    "statusCode": 200,
    "metadata": {
        "user": {
            "_id": "68049ac13a535436e4b29dda",
            "user_displayname": "Le Duc Nhan",
            "user_permission": "user"
        },
        "tokens": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA0OWFjMTNhNTM1NDM2ZTRiMjlkZGEiLCJ1c2VybmFtZSI6ImNvdW50ZXJzdHJpa2VyIiwiaWF0IjoxNzQ1MTMyNzcwLCJleHAiOjE3NDUzMDU1NzB9.SboM7MGnvEDM-mQ6ms2YCt2-SYNxL-ap-WlVLYYMbUY"
    }
}
```

---

## 3. \[POST] logout

**Method:** &nbsp; `POST /logout`  
**Description:** &nbsp; Đăng xuất tài khoản.
**Header:**

```json
{
    "x-client-id": <userId của user>,
    "authorization": <accesstoken>
}
```

**Request:**

```http
POST /api/v1/access/logout
```

**Response:**

```json
{
    "message": "Logged out",
    "statusCode": 200,
    "metadata": {
        "message": "Logged out successfully"
    }
}
```

---
