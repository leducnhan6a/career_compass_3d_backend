# Major's logic

## Base URL: &nbsp; `/api/v1/major`

> **Required header:**: &nbsp; `authorization` and `x-client-id`

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

---

## 1. \[GET] Get majors by unicode [admin / user]

**Method:** &nbsp; `GET /unicode`  
**Description:** &nbsp; lấy các ngành học theo mã trường (uni code)

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/major/unicode?uni_code=UIT
```

**Response:**

```json
{
    "message": "Get majors by university code successfully",
    "statusCode": 200,
    "metadata": [
            {
            "_id": "6804a3b3389ab87a9eed485d",
            "uni_code": "UIT",
            "major_name": "Electronic Commerce",
            "major_standard_score": 26.12,
            "major_aptitude_trends": [
                    "E",
                    "C",
                    "I"
                ]
            },
            {
            "_id": "6804a3b3389ab87a9eed485e",
            "uni_code": "UIT",
            "major_name": "Data Science",
            "major_standard_score": 27.5,
            "major_aptitude_trends": [
                    "I",
                    "C",
                    "R"
                ]
            },
            {...}
        ]
}
```

---

## 2. \[GET] Get majors include Aptitude [admin / user]

**Method:** &nbsp; `GET /aptitude`  
**Description:** &nbsp; lấy các ngành học theo khuynh hướng nghề nghiệp

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/major/aptitude?traits=RIC
```

**Response:**

```json
{
    "message": "Get majors include aptitude successfully",
    "statusCode": 200,
    "metadata": {
        "fullMatched": [
                {
                    "_id": "6804a3b3389ab87a9eed485e",
                    "uni_code": "UIT",
                    "major_name": "Data Science",
                    "major_standard_score": 27.5,
                    "major_aptitude_trends": [
                    "I",
                    "C",
                    "R"s
                    ]
                },
                        {
                    "_id": "6804a3b3389ab87a9eed4860",
                    "uni_code": "UIT",
                    "major_name": "Computer Networks and Data Communication",
                    "major_standard_score": 25.7,
                    "major_aptitude_trends": [
                    "R",
                    "I",
                    "C"
                    ]
                },
                {...}
        ]}
}
```

## 3. \[POST] create new major [admin]

**Method:** &nbsp; `POST /create`  
**Description:** &nbsp; tạo major mới

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Body:**

```json
{
    "uni_code": "UIT",
    "major_name": "Data Science",
    "major_standard_score": 27.5,
    "major_aptitude_trends": ["I", "C", "R"]
}
```

**Request:**

```http
POST /api/v1/major/create
```

**Response:**

```json
{
    "message": "Major created successfully",
    "statusCode": 201,
    "metadata": {
        "uni_code": "UIT",
        "major_name": "Data Science",
        "major_standard_score": 27.5,
        "major_aptitude_trends": ["I", "C", "R"],
        "_id": "6804a944f328b62c6153958e",
        "deleted": false,
        "createdAt": "2025-04-20T07:59:00.355Z",
        "updatedAt": "2025-04-20T07:59:00.355Z",
        "major_slug": "data-science",
        "__v": 0
    },
    "options": {}
}
```

## 4. \[PUT] update major [admin]

**Method:** &nbsp; `PUT /update/:majorId`  
**Description:** &nbsp; update major đã có qua majorId

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Body:**

```json
{
    "uni_code": "UIT",
    "major_name": "Data Science",
    "major_standard_score": 27.5,
    "major_aptitude_trends": ["E", "A", "R"]
}
```

**Request:**

```http
PUT /api/v1/major/update/:majorId
```

**Response:**

```json
{
    "message": "Major updated successfully",
    "statusCode": 200,
    "metadata": {
        "_id": "6804aae07c44d379ae8249f9",
        "uni_code": "UIT",
        "major_name": "Data Science",
        "major_standard_score": 27.5,
        "major_aptitude_trends": ["E", "A", "R"],
        "deleted": false,
        "createdAt": "2025-04-20T08:05:52.079Z",
        "updatedAt": "2025-04-20T08:08:00.733Z",
        "major_slug": "data-science",
        "__v": 0
    }
}
```

---

## 5. \[PATCH] soft delete major [admin]

**Method:** &nbsp; `PATCH /:majorId/delete`  
**Description:** &nbsp; xóa mềm major theo majorId

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Params:**

```json
{
    majorId: <lay id cua major>
}
```

**Request:**

```http
PATCH /api/v1/major/:majorId/delete
```

**Response:**

```json
{
    "message": "Major soft deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6804aae07c44d379ae8249f9",
        "uni_code": "UIT",
        "major_name": "Data Science",
        "major_standard_score": 27.5,
        "major_aptitude_trends": ["E", "A", "R"],
        "deleted": true,
        "createdAt": "2025-04-20T08:05:52.079Z",
        "updatedAt": "2025-04-20T08:12:15.886Z",
        "major_slug": "data-science",
        "__v": 0,
        "deletedAt": "2025-04-20T08:12:15.884Z"
    }
}
```

**Lưu ý:** &nbsp; Đây là xóa mềm.

---

## 6. \[PATCH] restore deleted major [admin]

**Method:** &nbsp; `PATCH /:majorId/restore`  
**Description:** &nbsp; hồi phục major đã xóa mềm theo majorId

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Params:**

```json
{
    majorId: <lay id cua major>
}
```

**Request:**

```http
PATCH /api/v1/major/:majorId/restore
```

**Response:**

```json
{
    "message": "Major soft deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6804aae07c44d379ae8249f9",
        "uni_code": "UIT",
        "major_name": "Data Science",
        "major_standard_score": 27.5,
        "major_aptitude_trends": ["E", "A", "R"],
        "deleted": false,
        "createdAt": "2025-04-20T08:05:52.079Z",
        "updatedAt": "2025-04-20T08:12:15.886Z",
        "major_slug": "data-science",
        "__v": 0,
        "deletedAt": "2025-04-20T08:12:15.884Z"
    }
}
```

**Lưu ý:** &nbsp; Đây là restore file đã xóa mềm.

---

## 7. \[DELETE] permanently delete major [admin]

**Method:** &nbsp; `DELETE /:majorId/restore`  
**Description:** &nbsp; xóa vĩnh viễn major theo majorId

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Params:**

```json
{
    majorId: <lay id cua major>
}
```

**Request:**

```http
DELETE /api/v1/major/:majorId/delete
```

**Response:**

```json
{
    "message": "Major permanently deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6804aae07c44d379ae8249f9",
        "uni_code": "UIT",
        "major_name": "Data Science",
        "major_standard_score": 27.5,
        "major_aptitude_trends": ["E", "A", "R"],
        "deleted": false,
        "createdAt": "2025-04-20T08:05:52.079Z",
        "updatedAt": "2025-04-20T08:14:08.221Z",
        "major_slug": "data-science",
        "__v": 0
    }
}
```

**Lưu ý:** &nbsp; Đây là xóa vĩnh viễn major

---
