# Skyline Weather

A decent weather and 5-day forecast app with a secure API proxy and dark/light mode features

## Features
- Search any city
- Current weather(temperature, humidity, wind, pressure, visibiltiy)
- 5-day forecast cards
- Dark / Light theme toggle
- Uses Cloudflare worker proxy to protect the API key

## Tech Stack
- HTML, CSS, JavaScript
- OpenWeather API
- Cloudflare Workers (API proxy)

## How it works
1. Frontend calls "/geo?q=City" on the Worker
2. Worker fetches OpenWeather geocoding and returns a lat/lon
3. Frontend calls "/weather?lat=...&lon=..." and "/forecast?lat=...&lon=..."
4. Worker fetches OpenWeather data securely for frontend to display

## Run locally
- Use Live Server (VS Code) or any static server
- Go to the website and search any city

## Deployment
- Frontend hosted on Github Pages
- Backend deployed as a Cloudflare Worker

## Credits
Weather data provided by OpenWeather.