
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

Status Code: 200
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

Successful response with no favorites in the database:
```json
[]
```

**Unsuccessful Response**

Status Code: 500
```json
{
  "message": "<REASON>"
}
```

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

### All Playlists
`GET /api/v1/playlists`

Returns a list of all playlists

**Successful Response**

Status Code: 200
```
[
  {
    "id": 1,
    "title": "Cleaning House",
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  },
  {
    "id": 2,
    "title": "Running Mix",
    "createdAt": 2019-11-26T16:03:43+00:00,
    "updatedAt": 2019-11-26T16:03:43+00:00
  },
]
```

Successful response with no playlists in the database:
```
[]
```

**Unsuccessful Response**

Status Code: 500
```json
{
  "message": "<REASON>"
}
```

---

### Playlist Creation
`POST /api/v1/playlists`

Adds a playlist to the database

This endpoint requires a body with the following format:
```
{
  "title": "Cleaning House"
}
```

**Successful Response**


Status Code: 201`
```
{
  "id": 1,
  "title": "Cleaning House",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00,
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

### Update Playlist
`PUT /api/v1/playlists/:id`

Updates the playlist with the corresponding `:id`

This endpoint requires a request body with the following format:

```
{
  "title": "<NEW TITLE>"
}
```

**Successful Response**
Status code 200
```
{
  "id": 2,
  "title": "<NEW TITLE>",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": <NEW UPDATED TIMESTAMP>
}
```

**Unsuccessful Response: No playlist with corresponding id**
Status code 404
```
{
  "message": "Playlist with that ID does not exist!"
}
```

**Unsuccessful Response: id is not a number**
Status code 500
```
{
  "message": "ID must be a number!"
}
```

**Unsuccessful Response: invalid request body**
Status code 500
```
{
  "message": "Invalid request body"
}
```

---

### Playlist Deletion
`DELETE /api/v1/playlists/:id`
Deletes the playlist from the database with the corresponding `:id`

**Successful Response**

Status Code: 204

**Unsuccessful Response: No playlist with corresponding id**
Status code 404
```
{
  "message": "Playlist with that ID does not exist!"
}
```

**Unsuccessful Response: id is not a number**
Status code 500
```
{
  "message": "ID must be a number!"
}
```

---

