# Wakey Alarm

Wakey Alarm is a fun and interactive alarm clock application that requires you to answer a series of questions based on the weather and the day to turn off the alarm to wake you up and make you ready for the day alongside. This project is built using React and integrates external APIs for weather data.

## Problem it Solves

The app solves the problem of mindlessly turning off alarms and going back to sleep. By forcing the user to answer questions about the current weather, and the day, the user becomes more engaged and aware, making it harder to stay in bed.

## Features

- Set and manage alarms.
- Display the current weather, temperature, and forecast.
- Display the current date, time and the weekday
- The user has to answer questions (e.g., current temperature) correctly to turn off the alarm.

## Project Setup

To set up and run this project locally, follow these steps:

### Prerequisites
- Node.js installed on your system.
- An weatherstack API key.

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/asiftauhid/wakeyalarm
    ```
2. Navigate into the project directory:
   ```bash
    cd wakeyalarm
    ```
3. Install the dependencies:
   ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add your API keys:
   ```bash
    REACT_APP_WEATHER_API_KEY=your_weather_api_key
    ```
5. Start the development server:
   ```bash
    npm start
    ```
6. The app will be available at `http://localhost:3000`

### APIs Used
Weatherstack API
- Purpose: Fetches the current weather, temperature, and forecast based on the user's location.
- Endpoint: http://api.weatherstack.com/current
- Integration: The app retrieves weather data using geolocation coordinates and displays it on the screen.

### AI Credits

This project utilized ChatGPT for several aspects, including:

- Fixing errors in the code.
- Generating ideas for the overall project structure and API integrations.
- Suggesting improvements to the alarm and weather data handling logic.
- Code snippets: Function to format the time, geolocation retrieval, SetAlarmTime input, and real-time updates using setInterval were suggested by AI.
