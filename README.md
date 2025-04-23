# Survey's logic

## \* \[GET] Get all questions with limit, skip [no authentication]

**Method:** &nbsp; `GET /questionsSurvey`

**Description:** &nbsp; lấy tất cả question trong database chưa bị xóa mềm (deleted), giới hạn được số lượng, random phần frontend

**Query (optional: limit, sort, page -> truyền y chang ví dụ body):**

```json
{
    "limit": 2,
    "page": 2,
}
```

**Request:**

```http
GET /api/v1/survey/questionsSurvey
```

**Response:**

```json
{
    "message": "Get all questions successfully!",
    "statusCode": 200,
    "metadata": [
        {
            "_id": "67ff79cdda05b1d3bb725fb1",
            "question_code": "A",
            "question_text": "cau hoi 3 (R)"
        },
        {
            "_id": "67ff79c7da05b1d3bb725fae",
            "question_code": "R",
            "question_text": "cau hoi 3 (R)"
        }
    ]
}
```

---

> **Required header:**: &nbsp; `authorization` and `x-client-id`

```json
{
    "x-client-id": <userID của user>,
    "authorization": <tokens của user>
}
```

> **Base URL**: &nbsp; `/api/v1/survey`

---

## 1. \[GET] Get all questions with the same type [admin / user]

**Method:** &nbsp; `GET /questions`  
**Description:** &nbsp; Query questions by key: `groupName` and a string value is one of `R` | `I` | `A` | `S` | `E` | `C`

**Request:**

```http
GET /api/v1/survey/questions?groupName=R
```

**Response:**

```json
{
    "message": "Get questions by group name successfully!",
    "statusCode": 200,
    "metadata": [
        {
            "_id": "67ffe70bbebc649b24d6bc78",
            "question_text": "Bạn thích sửa chữa các món đồ trong nhà khi chúng bị hỏng.",
            "question_code": "R"
        },
        {...},...
    ]
}
```

---

## 2. \[POST] Create new question [ admin ]

**Method:** &nbsp; `POST /questions`  
**Description:** &nbsp; Create a new Holland question by define question code and question text.

**Request Body:**

```json
{
    "group": "R",
    "question": "Một con gà xoè ra mấy cái cánh"
}
```

**Response:**

```json
{
    "message": "Question created successfully",
    "statusCode": 201,
    "metadata": {
        "question_code": "R",
        "question_text": "Một con gà xoè ra mấy cái cánh",
        "_id": "6800efae57d4b086a061e1aa",
        "deleted": false,
        "createdAt": "2025-04-17T11:25:15.660Z",
        "updatedAt": "2025-04-17T11:25:15.660Z",
        "__v": 0
    },
    "options": {}
}
```

---

## 3. \[POST] Process survey result [user]

**Method:** &nbsp; `POST /result`  
**Description:** &nbsp; Submit answers to calculate Holland Code (WIP)

**Request Body:**

```json
{
    "userId": "67ffd670ec9b781c1af01a16",
    "answers": [
        { "group": "R", "value": 3 },
        { "group": "R", "value": 5 },
        { "group": "I", "value": 3 },
        { "group": "A", "value": 1 },
        { "group": "E", "value": 3 }
    ]
}
```

**Response:**

```json
{
    "message": "Solve survey result successfully",
    "statusCode": 200,
    "metadata": {
        "hollandCode": "RIE",
        "groupScores": {
            "R": {
                "groupScore": 8,
                "percentage": 80
            },
            "I": {
                "groupScore": 3,
                "percentage": 60
            },
            "A": {
                "groupScore": 1,
                "percentage": 20
            },
            "S": {
                "groupScore": 0,
                "percentage": 0
            },
            "E": {
                "groupScore": 3,
                "percentage": 60
            },
            "C": {
                "groupScore": 0,
                "percentage": 0
            }
        },
        "top3Traits": [
            {
                "group": "R",
                "score": 8,
                "percentage": 80
            },
            {
                "group": "I",
                "score": 3,
                "percentage": 60
            },
            {
                "group": "E",
                "score": 3,
                "percentage": 60
            }
        ],
        "totalScore": 15,
        "maxScore": 25,
        "totalQuestions": 5,
        "createdAt": "2025-04-17T12:02:25.006Z"
    }
}
```

---

## 4. \[GET] Get user's history results [admin / user]

**Method:** &nbsp; `GET /history`  
**Description:** &nbsp; Fetch all result history for a given user ID (Note: using body in GET request is non-standard)

**Request Body:**

```json
{
    "userId": "67ffd670ec9b781c1af01a16"
}
```

**Response:**

```json
{
    "message": "Get user history result successfully",
    "statusCode": 200,
    "metadata": [
        {
            "action": "survey_result",
            "timestamp": "2025-04-16T17:07:46.140Z",
            "metadata": {
                "hollandCode": "RIE",
                "groupScores": {
                    "R": {
                        "groupScore": 8,
                        "percentage": 80
                    },
                    "I": {
                        "groupScore": 3,
                        "percentage": 60
                    },
                    "A": {
                        "groupScore": 1,
                        "percentage": 20
                    },
                    "S": {
                        "groupScore": 0,
                        "percentage": 0
                    },
                    "E": {
                        "groupScore": 3,
                        "percentage": 60
                    },
                    "C": {
                        "groupScore": 0,
                        "percentage": 0
                    }
                },
                "top3Traits": [
                    {
                        "group": "R",
                        "score": 8,
                        "percentage": 80
                    },
                    {
                        "group": "I",
                        "score": 3,
                        "percentage": 60
                    },
                    {
                        "group": "E",
                        "score": 3,
                        "percentage": 60
                    }
                ],
                "totalScore": 15,
                "maxScore": 25,
                "totalQuestions": 5,
                "createdAt": "2025-04-17T12:02:25.006Z"
            },
            "_id": "67ffe4465371cc0e5003fdc5"
        }
    ]
}
```

---

## 5. \[PUT] Update an available question [admin]

**Method:** &nbsp; `PUT /questions/:questionId`  
**Description:** &nbsp; Update question text by its ID

**Example Request:**

```http
PUT /api/v1/survey/questions/6800efae57d4b086a061e1aa
```

**Request Body:**

```json
{
    "question_text": "Bạn thường cảm năng một ai đó",
    "question_code": "S"
}
```

**Response:**

```json
{
    "message": "Question updated successfully",
    "statusCode": 200,
    "metadata": {
        "_id": "6800efae57d4b086a061e1aa",
        "question_code": "S",
        "question_text": "Bạn thường cảm năng một ai đó",
        "deleted": false,
        "createdAt": "2025-04-17T12:10:22.662Z",
        "updatedAt": "2025-04-17T12:10:35.422Z",
        "__v": 0
    }
}
```

---

## 6. \[PATCH] Soft delete a question [ admin ]

**Method:** &nbsp; `PATCH /questions/:questionId/delete`  
**Description:** &nbsp; Soft delete a question (won’t appear in list but not fully deleted)

**Example Request:**

```http
PATCH /api/v1/survey/questions/6800efae57d4b086a061e1aa/delete
```

**Response:**

```json
{
    "message": "Question soft deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6800efae57d4b086a061e1aa",
        "question_code": "S",
        "question_text": "Bạn thường cảm năng một ai đó",
        "deleted": true,
        "createdAt": "2025-04-17T12:10:22.662Z",
        "updatedAt": "2025-04-17T12:12:05.422Z",
        "__v": 0,
        "deletedAt": "2025-04-17T12:12:05.421Z"
    }
}
```

---

## 7. \[PATCH] Restore a deleted question [admin]

**Method:** &nbsp; `PATCH /questions/:questionId/restore`  
**Description:** &nbsp; Restore a soft-deleted question

**Example Request:**

```http
PATCH /api/v1/survey/questions/6800efae57d4b086a061e1aa/restore
```

**Response:**

```json
{
    "message": "Question restored",
    "statusCode": 200,
    "metadata": {
        "_id": "6800efae57d4b086a061e1aa",
        "question_code": "S",
        "question_text": "Bạn thường cảm năng một ai đó",
        "deleted": false,
        "createdAt": "2025-04-17T12:10:22.662Z",
        "updatedAt": "2025-04-17T12:12:57.282Z",
        "__v": 0
    }
}
```

---

## 8. \[DELETE] Permanently delete question [admin]

**Method:** &nbsp; `DELETE /questions/:questionId`  
**Description:** &nbsp; Permanently delete a question by ID

**Example Request:**

```http
DELETE /api/v1/survey/questions/6800efae57d4b086a061e1aa
```

**Response:**

```json
{
    "message": "Question deleted",
    "statusCode": 200,
    "metadata": {
        "_id": "6800efae57d4b086a061e1aa",
        "question_code": "S",
        "question_text": "Bạn thường cảm năng một ai đó",
        "deleted": false,
        "createdAt": "2025-04-17T12:10:22.662Z",
        "updatedAt": "2025-04-17T12:12:57.282Z",
        "__v": 0
    }
}
```
