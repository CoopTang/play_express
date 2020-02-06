
# Play
A back-end api that exposes endpoints for favorite songs added from the Musix Match API

## Tech/framework used
<b>Built with</b>
- Express
- Node.js
- PostgreSQL

Once these are installed, clone the repository to your local machine 

Once cloned onto your computer, `cd` into the project directory and run `npm install ` to install all required packages for the project.
## API Reference
All endpoints require the following headers:
```json
"Content-Type": "application/json",
"Accept": "application/json"
```

---

### All Favorites
`GET /api/v1/favorites`

Returns a list of all favorites

**Successful Response**
```json
[
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen",
    "genre": "Rock",
    "rating": 88
  },
  {
    "id": 2,
    "title": "Careless Whisper",
    "artistName": "George Michael",
    "genre": "Pop",
    "rating": 93
  },
]
```

**Unsuccessful Response**

---

### Favorite Creation
`POST /api/v1/favorites`

Adds a favorite song to the database

This endpoint requires a body with the following format:
```json
{
  "title": "We Will Rock You", 
  "artistName": "Queen"
}
```

**Successful Response**


Status Code: 200
```json
{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen",
  "genre": "Rock",
  "rating": 88
}
```

**Unsuccessful Response**

Status Code: 400
```json
{
  "message": "<REASON>"
}
```

---

### Single Favorite
`GET /api/v1/favorites/:id`

Returns the favorite corresponding to `:id`


**Successful Response**


Status Code: 200
```json
{
     "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen",
    "genre": "Rock",
    "rating": 88 
}
```
**Unsuccessful Response**

Status Code: 404
```json
{
  "message": "Favorite with that ID does not exist!"
}
```

---

### User Favorite Deletion
`DELETE /api/v1/favorites/:id`
Deletes the favorite from the database with the corresponding `:id`

**Successful Response**


Status Code: 204

**Unsuccessful Response**

Status Code: 404
```json
{
  "message": "Favorite with that ID does not exist!"
}
```

---
