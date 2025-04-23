# Event's logic

## Base URL: &nbsp; `/api/v1/event`

> **Required header:**: &nbsp; `authorization` and `x-client-id`

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

---

## 1. \[GET] Get all articles [admin / user]

**Method:** &nbsp; `GET /`  
**Description:** &nbsp; lấy tất cả các bài viết sẵn có trong database

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Request:**

```http
GET /api/v1/event
```

**Response:**

```json
{
    "message": "Get all articles successfully",
    "statusCode": 200,
    "metadata": [
        {
            "_id": "6808a0d1d5f6e41821bde414",
            "source": "vnexpress",
            "title": "Đại học Khoa học Tự nhiên TP HCM xét tuyển bằng 17 tổ hợp",
            "url": "https://vnexpress.net/17-to-hop-xet-tuyen-truong-dai-hoc-khoa-hoc-tu-nhien-nam-2025-4877064.html",
            "publishedAt": "2025-04-22T11:20:00.000Z",
            "thumbnail": "https://i1-vnexpress.vnecdn.net/2025/04/22/487506855-1059448586216270-325-5468-3762-1745289571.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=qCP1rLslAl0EX2s-gA5zUQ",
            "deleted": false,
            "createdAt": "2025-04-23T08:12:01.729Z",
            "updatedAt": "2025-04-23T08:12:01.729Z",
            "__v": 0
        },
        {
            "_id": "6808a0d1d5f6e41821bde416",
            "source": "vnexpress",
            "title": "Học phí ĐH Y khoa Phạm Ngọc Thạch dự kiến cao nhất 55,2 triệu đồng",
            "url": "https://vnexpress.net/hoc-phi-dh-y-khoa-pham-ngoc-thach-du-kien-cao-nhat-55-2-trieu-dong-4876730.html",
            "publishedAt": "2025-04-21T15:00:00.000Z",
            "thumbnail": "https://i1-vnexpress.vnecdn.net/2025/04/21/486341531-653612470753027-2534-5539-2208-1745216825.jpg?w=300&h=180&q=100&dpr=1&fit=crop&s=6NJwTxpNNjQwp-i_kNCqhQ",
            "deleted": false,
            "createdAt": "2025-04-23T08:12:01.736Z",
            "updatedAt": "2025-04-23T08:12:01.736Z",
            "__v": 0
        },
        {...}
    ]
}
```

---

## 2. \[POST] create new event [admin]

**Method:** &nbsp; `POST /create`  
**Description:** &nbsp; tạo event mới, lưu vào trong database

**Header:**

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

**Body:** (optional: publishedAt)

```json
{
    "source": "tuoitre",
    "title": "Webdev Adventure thong bao",
    "url": "https://www.webdevstudios.org/",
    "thumbnail": "https://cdn2.tuoitre.vn/zoom/260_163/471584752817336320/2025/3/17/170325trang-14anh-nho2-read-only-1742172129007763324057-54-0-1654-2560-crop-1742172309580426565128.jpg",
    "publishedAt": "02-25-2024"
}
```

**Request:**

```http
POST /api/v1/event/create
```

**Response:**

```json
{
    "message": "Article created manually",
    "statusCode": 201,
    "metadata": {
        "source": "tuoitre",
        "title": "Webdev Adventure thong bao",
        "url": "https://www.webdevstudios.org/",
        "publishedAt": "2024-02-24T17:00:00.000Z",
        "thumbnail": "https://cdn2.tuoitre.vn/zoom/260_163/471584752817336320/2025/3/17/170325trang-14anh-nho2-read-only-1742172129007763324057-54-0-1654-2560-crop-1742172309580426565128.jpg",
        "_id": "6808a720d1926b01c3aff19e",
        "deleted": false,
        "createdAt": "2025-04-23T08:38:56.515Z",
        "updatedAt": "2025-04-23T08:38:56.515Z",
        "__v": 0
    },
    "options": {}
}
```

---

## 3. \[PATCH] soft delete event [admin]

**Method:** &nbsp; `PATCH /:scraperId/delete`  
**Description:** &nbsp; xóa mềm event theo eventId (scrapeId)

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
    scraperId: <lay id cua event>
}
```

**Request:**

```http
PATCH /api/v1/event/:scraperId/delete
```

**Response (scraperID: 6808a0d1d5f6e41821bde414):**

```json
{
    "message": "Article soft deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6808a0d1d5f6e41821bde414",
        "source": "vnexpress",
        "title": "Đại học Khoa học Tự nhiên TP HCM xét tuyển bằng 17 tổ hợp",
        "url": "https://vnexpress.net/17-to-hop-xet-tuyen-truong-dai-hoc-khoa-hoc-tu-nhien-nam-2025-4877064.html",
        "publishedAt": "2025-04-22T11:20:00.000Z",
        "thumbnail": "https://i1-vnexpress.vnecdn.net/2025/04/22/487506855-1059448586216270-325-5468-3762-1745289571.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=qCP1rLslAl0EX2s-gA5zUQ",
        "deleted": true,
        "createdAt": "2025-04-23T08:12:01.729Z",
        "updatedAt": "2025-04-23T08:47:09.949Z",
        "__v": 0,
        "deletedAt": "2025-04-23T08:47:09.948Z"
    }
}
```

**Lưu ý:** &nbsp; Đây là xóa mềm.

---

## 4. \[PATCH] restore deleted major [admin]

**Method:** &nbsp; `PATCH /:scraperId/restore`  
**Description:** &nbsp; hồi phục event đã xóa mềm theo eventId

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
    majorId: <lay id cua event>
}
```

**Request:**

```http
PATCH /api/v1/event/:scraperId/restore
```

**Response (scraperID: 6808a0d1d5f6e41821bde414):**

```json
{
    "message": "Article restored",
    "statusCode": 200,
    "metadata": {
        "_id": "6808a0d1d5f6e41821bde414",
        "source": "vnexpress",
        "title": "Đại học Khoa học Tự nhiên TP HCM xét tuyển bằng 17 tổ hợp",
        "url": "https://vnexpress.net/17-to-hop-xet-tuyen-truong-dai-hoc-khoa-hoc-tu-nhien-nam-2025-4877064.html",
        "publishedAt": "2025-04-22T11:20:00.000Z",
        "thumbnail": "https://i1-vnexpress.vnecdn.net/2025/04/22/487506855-1059448586216270-325-5468-3762-1745289571.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=qCP1rLslAl0EX2s-gA5zUQ",
        "deleted": false,
        "createdAt": "2025-04-23T08:12:01.729Z",
        "updatedAt": "2025-04-23T08:50:11.650Z",
        "__v": 0
    }
}
```

**Lưu ý:** &nbsp; Đây là restore file đã xóa mềm.

---

## 5. \[DELETE] permanently delete event [admin]

**Method:** &nbsp; `DELETE /:scraperId/delete`  
**Description:** &nbsp; xóa vĩnh viễn event theo eventId

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
    scraperId: <lay id cua event>
}
```

**Request:**

```http
DELETE /api/v1/major/:scraperId/delete
```

**Response:**

```json
{
    "message": "Article permanently deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6808a0d1d5f6e41821bde414",
        "source": "vnexpress",
        "title": "Đại học Khoa học Tự nhiên TP HCM xét tuyển bằng 17 tổ hợp",
        "url": "https://vnexpress.net/17-to-hop-xet-tuyen-truong-dai-hoc-khoa-hoc-tu-nhien-nam-2025-4877064.html",
        "publishedAt": "2025-04-22T11:20:00.000Z",
        "thumbnail": "https://i1-vnexpress.vnecdn.net/2025/04/22/487506855-1059448586216270-325-5468-3762-1745289571.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=qCP1rLslAl0EX2s-gA5zUQ",
        "deleted": false,
        "createdAt": "2025-04-23T08:12:01.729Z",
        "updatedAt": "2025-04-23T09:13:40.079Z",
        "__v": 0
    }
}
```

**Lưu ý:** &nbsp; Đây là xóa vĩnh viễn event

---
