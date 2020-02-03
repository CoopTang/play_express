
# Sweater Weather
A back-end api that exposes endpoints for the weather of a location, and the favorite location of users

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

### Forecast
`GET /api/v1/forecast?location=<LOCATION>`

This endpoint requires a body with the following format:
```json
{
	"api_key": "<YOUR API KEY>"
}

Returns the current weather, the weather for the next 48 hours, and the weather for the next week. The user will get the following response:
```json
{
    "location": "Denver, CO, USA",
    "currently": {
        "summary": "Clear",
        "icon": "clear-night",
        "precipIntensity": 0,
        "precipProbability": 0,
        "temperature": 49.57,
        "humidity": 0.2,
        "pressure": 998,
        "windSpeed": 3.05,
        "windGust": 10.35,
        "windBearing": 178,
        "cloudCover": 0.29,
        "visibility": 10
    },
    "hourly": {
        "summary": "Foggy tomorrow afternoon and evening.",
        "icon": "snow",
        "data": [
            {
                "time": 1580702400,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 51.51,
                "humidity": 0.19,
                "pressure": 997.4,
                "windSpeed": 3.95,
                "windGust": 11.37,
                "windBearing": 178,
                "cloudCover": 0.22,
                "visibility": 10
            },
        ]
    },
    "daily": {
        "summary": "Possible light snow tomorrow.",
        "icon": "snow",
        "data": [
            {
                "sunriseTime": 1580652480,
                "time": 1580626800,
                "icon": "clear-day",
                "summary": "Clear throughout the day.",
                "sunsetTime": 1580689260,
                "precipIntensity": 0.0002,
                "precipIntensityMax": 0.002,
                "precipIntensityMaxTime": 1580709540,
                "precipProbability": 0.06,
                "precipType": "rain",
                "temperatureHigh": 74.6,
                "temperatureLow": 29.46,
                "humidity": 0.16,
                "pressure": 1006.1,
                "windSpeed": 6.86,
                "windGust": 23.85,
                "cloudCover": 0.19,
                "visibility": 10,
                "temperatureMin": 40.71,
                "temperatureMax": 74.6
            },
        ]
    }
}
```

---

### User Favorite Creation
`POST /api/v1/favorites`

This endpoint requires a body with the following format:
```json
{
	"location": "Denver, CO",
	"api_key": "<YOUR API KEY>"
}
```
If the registration is successful, the user will get the following response body:

```json
{
    "message": "Boulder, CO has been added to your favorites"
}
```

An unsuccessful registration will return a response stating the reason in the folloiwng format:
```json
{
  "message": "Unauthorized"
}
```

---

### User Favorite List
`POST /api/v1/favorites`

This endpoint requires a body with the following format:
```json
{
	"api_key": "<YOUR API KEY"
}
```

A successful response will look like the following:

```json
[
    {
        "location": "Denver, CO",
        "current_weather": {
            "summary": "Mostly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 45.22,
            "humidity": 0.81,
            "pressure": 1007.6,
            "windSpeed": 1.31,
            "windGust": 3.52,
            "windBearing": 278,
            "cloudCover": 0.61,
            "visibility": 10
        }
    },
    {
        "location": "Boulder, CO",
        "current_weather": {
            "summary": "Mostly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 45.22,
            "humidity": 0.81,
            "pressure": 1007.6,
            "windSpeed": 1.31,
            "windGust": 3.52,
            "windBearing": 278,
            "cloudCover": 0.61,
            "visibility": 10
        }
    }
]
```

---

### User Favorite Deletion
`DELETE /api/v1/favorites`

This endpoint requires a body with the following format:
```json
{
	"location": "Boulder, CO",
	"api_key": "<YOUR API KEY>"
}
```

A successful response will return a 204 status code.

---
