# Survey's logic

## Base URL: &nbsp; `/api/v1/model`

## 1. \[GET] Get all non - deleted 3D Models [user / admin]

**Method:** &nbsp; `GET /`  
**Description:** &nbsp; lấy thông tin tất cả các file 3d model hiện có trong database mà chưa bị xóa mềm.
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/model
```

**Response:**

```json
{
    "message": "Get all 3d models successfully!",
    "statusCode": 200,
    "metadata": [
        {
        "_id": "6802903306d308f789f0e16d",
        "object3d_name": "chemistry_lab",
        "object3d_description": "low_poly_chemistry_lab",
        "object3d_thumbnailUrl": "https://qhacbnetoymsukdhzioa.supabase.co/storage/v1/object/public/webdevpublic/uploads/low_poly_chemistry_lab.png",
        "object3d_modelUrl": "uploads/low_poly_chemistry_lab.glb",
        "updatedAt": "2025-04-19T02:21:39.511Z",
        "object3d_bucket": "webdev"
        },
        {...},...
    ]
}
```

---

## 2. \[GET] Get model detail by modelId [user / admin]

**Method:** &nbsp; `GET /:modelId/detail`  
**Description:** &nbsp; lấy thông tin chi tiết của model 3D qua modelId của nó.
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/model/:modelId/detail
```

**Response:**

```json
{
    "message": "Get detail of model use modelId successfully!",
    "statusCode": 200,
    "metadata": {
        "_id": "6802903306d308f789f0e16d",
        "object3d_name": "chemistry_lab",
        "object3d_description": "low_poly_chemistry_lab",
        "object3d_thumbnailUrl": "https://qhacbnetoymsukdhzioa.supabase.co/storage/v1/object/public/webdevpublic/uploads/low_poly_chemistry_lab.png",
        "object3d_modelUrl": "uploads/low_poly_chemistry_lab.glb",
        "updatedAt": "2025-04-19T02:21:39.511Z",
        "deleted": false,
        "object3d_bucket": "webdev"
    }
}
```

| Thành phần            | Nhiệm vụ                                                                          |
| --------------------- | --------------------------------------------------------------------------------- |
| object3d_thumbnailUrl | lấy ảnh thumbnail để load ra cho user thấy                                        |
| object3d_name         | 3d name                                                                           |
| deleted               | thông tin xóa mềm (`false`: **chưa xóa**, `true`: **đã xóa mềm, chưa vĩnh viễn**) |

---

## 3. \[GET] Get deleted model [ admin ]

**Method:** &nbsp; `GET /deleted`  
**Description:** &nbsp; lấy thông tin tất cả model 3D đã bị xóa mềm (chưa vĩnh viễn).
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/model/deleted
```

**Response:**

```json
{
    "message": "Get all 3d models successfully!",
    "statusCode": 200,
    "metadata": [
        {
            "_id": "6802903306d308f789f0e16d",
            "object3d_name": "chemistry_lab",
            "object3d_description": "low_poly_chemistry_lab",
            "object3d_thumbnailUrl": "https://qhacbnetoymsukdhzioa.supabase.co/storage/v1/object/public/webdevpublic/uploads/low_poly_chemistry_lab.png",
            "object3d_modelUrl": "uploads/low_poly_chemistry_lab.glb",
            "updatedAt": "2025-04-19T07:49:13.050Z",
            "object3d_bucket": "webdev",
            "deletedAt": "2025-04-19T07:49:13.048Z"
        }
    ]
}
```

**Lưu ý:** đây là đã xóa mềm rồi nha!

---

## 4. \[PUT] Update model detail by modelId [ admin ]

**Method:** &nbsp; `PUT /:modelId/detail`  
**Description:** &nbsp; cập nhật thông tin của model qua modelId.
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
    "object3d_name": "chemistry_lab",
    "object3d_description": "webdev lam trong mua thi giua ki"
}
```

**Request:**

```http
PUT /api/v1/model/:modelId/detail
```

**Response:**

```json
{
    "message": "Get all 3d models successfully!",
    "statusCode": 200,
    "metadata": [
        {
            "_id": "6802903306d308f789f0e16d",
            "object3d_name": "chemistry_lab",
            "object3d_description": "low_poly_chemistry_lab",
            "object3d_thumbnailUrl": "https://qhacbnetoymsukdhzioa.supabase.co/storage/v1/object/public/webdevpublic/uploads/low_poly_chemistry_lab.png",
            "object3d_modelUrl": "uploads/low_poly_chemistry_lab.glb",
            "updatedAt": "2025-04-19T07:49:13.050Z",
            "object3d_bucket": "webdev",
            "deletedAt": "2025-04-19T07:49:13.048Z"
        }
    ]
}
```

**Lưu ý:** chỉ update được thông tin của chưa xóa mềm.

---

## 5. \[PATCH] Soft delete model by modelId [ admin ]

**Method:** &nbsp; `PATCH /:modelId/delete`  
**Description:** &nbsp; cập nhật thông tin của model qua modelId.
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
PATCH /api/v1/model/:modelId/delete
```

**Response:**

```json
{
    "message": "Soft delete model use modelId successfully!",
    "statusCode": 200,
    "metadata": {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
    }
}
```

**Lưu ý:**&nbsp; đây là xóa mềm nha.

---

## 6. \[DELETE] Force delete model by modelId [ admin ]

**Method:** &nbsp; `DELETE /:modelId/delete`  
**Description:** &nbsp; Xóa vĩnh viễn model qua modelId.
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
DELETE /api/v1/model/:modelId/delete
```

**Response:**

```json
{
    "message": "Force delete model use modelId successfully!",
    "statusCode": 200,
    "metadata": {
        "_id": "68035d47389ab87a9eed4853",
        "object3d_name": "chemistry_lab_clone",
        "object3d_description": "low_poly_chemistry_lab_clone",
        "object3d_thumbnailUrl": "https://qhacbnetoymsukdhzioa.supabase.co/storage/v1/object/public/webdevpublic/uploads/low_poly_chemistry_lab.png",
        "object3d_modelUrl": "uploads/low_poly_chemistry_lab.glb",
        "updatedAt": "2025-04-19T07:49:13.050Z",
        "deleted": true,
        "object3d_bucket": "webdev",
        "deletedAt": "2025-04-19T07:49:13.048Z"
    }
}
```

**Lưu ý:**&nbsp; đây là xóa hẳn hỏi, xóa luôn khỏi database.

---

## 7. \[PATCH] Restore model by modelId [ admin ]

**Method:** &nbsp; `PATCH /:modelId/restore`  
**Description:** &nbsp; Xóa vĩnh viễn model qua modelId.
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
PATCH /api/v1/model/:modelId/restore
```

**Response:**

```json
{
    "message": "Restore deleted model use modelId successfully!",
    "statusCode": 200,
    "metadata": {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
    }
}
```

**Lưu ý:**&nbsp; đây là restore, từ xóa mềm thành tồn tại trong non - deleted model

---

## 8. \[GET] Restore model by modelId [ admin ]

**Method:** &nbsp; `GET /:modelId`  
**Description:** &nbsp; Lấy signed URL từ supabase của model qua modelId.
**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/model/:modelId
```

**Response:**

```json
{
    "message": "Restore deleted model use modelId successfully!",
    "statusCode": 200,
    "metadata": {
        "name": "chemistry_lab",
        "ttl": 300,
        "url": "https://qhacbnetoymsukdhzioa.supabase.co/storage/v1/object/sign/webdev/uploads/low_poly_chemistry_lab.glb?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUyYzc5NWEyLWNiMTAtNDllYS04NThjLWFhYmFjNGQ1ZWYwNiJ9.eyJ1cmwiOiJ3ZWJkZXYvdXBsb2Fkcy9sb3dfcG9seV9jaGVtaXN0cnlfbGFiLmdsYiIsImlhdCI6MTc0NTA1MTQ2MiwiZXhwIjoxNzQ1MDUxNzYyfQ.ndJbXqJuu2erOaR2YpPZpcRiJG8noSqqjYbb2tB3mEs"
    }
}
```

**Lưu ý:**&nbsp; đọc doc hướng dẫn frontend để biết thêm chi tiết.

---
