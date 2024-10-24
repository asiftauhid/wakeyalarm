//This project used Chatgpt for fixing errors, correcting codes, retrieving some of the ideas and the codes

import React, { useState, useEffect } from 'react';

//API informations
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const WEATHER_API_URL = `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=`

// const PERPLEXITY_API_KEY = process.env.REACT_APP_WEATHER_API_KEY
// const PERPLEXITY_API_URL = 

function App() {
  return (
    <div>
      <img src="/statics/images/alarm-clock.png" alt="Logo" style={{ width: '100px', height: 'auto' }} />
      <AlarmClock />
    </div>
  );
}

const AlarmClock = () => {
  //Initialize required states for alarm clock
  const [alarmTime, setAlarmTime] = useState('');
  const [isRinging, setIsRinging] = useState(false);
  const [alarmScheduled, setAlarmScheduled] = useState(null);
  const [alarmSound, setAlarmSound] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [dateTime, setDateTime] = useState({});
  const [message, setMessage] = useState('');

  const handleSetAlarm = () => {
    if (alarmTime) {
      setAlarmScheduled(alarmTime);
      setMessage(`Alarm set for ${alarmTime}`);
    } else {
      setMessage('Please set a valid time.');
    }
  };

  //suggested by chatgpt 
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  //using the api inside the useEffect
  useEffect(() => {
    // Fetch weather data using geolocation
    const fetchWeather = async (latitude, longitude) => {
      const response = await fetch(`${WEATHER_API_URL}${latitude},${longitude}`);
      const data = await response.json();
      setWeatherData(data.current); //retrieving the weather data fom the api
    };

    //getting the users latitue and longitude using geolocation
    //suggested by chatgpt
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchWeather(latitude, longitude); //passing coords data to the fetchWeather function
        },
        (error) => {
          console.error("Error fetching geolocation: ", error);
        }
      );
    }
  }, []);

  //retrieving date and time data
  useEffect(() => {
    // Fetch date and time
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString();
      const date = now.toLocaleDateString();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });

      setDateTime({ time, date, day });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); //calling it every second to get real time updates

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  //For later implementation
  // useEffect(() => {
  //   //Fetch word of the day

  //   //Here it'll ask perplexity api to give one difficult formal word and give the meaning of that in one sentence and it'll ask the user to input the answer as well along with temperature and day
    
  // })

  //checking alarm time and playing the sound on loop
  useEffect(() => {
    // Check if it's time to ring the alarm
    const checkAlarm = () => {
      const now = new Date();
      const currentTime = formatTime(now); // Format current time to 'HH:MM'

      if (alarmScheduled === currentTime) {
        setIsRinging(true);
        setMessage('Alarm is ringing! Answer the questions to stop.');
        if (!alarmSound) {
          const sound = new Audio('/statics/iphone_alarm.mp3');
          sound.loop = true; // Make the sound loop
          sound.play();
          setAlarmSound(sound);
        }
      }
    };

    const interval = setInterval(checkAlarm, 1000); //again checking on real time
    return () => clearInterval(interval);
  }, [alarmScheduled, alarmSound]);

  //stopp alarm function and set the values as default
  const stopAlarm = () => {
    if (alarmSound) {
      alarmSound.pause(); 
      setAlarmSound(null);
      setIsRinging(false);
      setAlarmScheduled(null);
      setAlarmTime('');
      setMessage('Alarm stopped!! Set a new alarm.');
    }
  };

  //input for setting alarm
  //help from gpt
  return (
    <div>
      {!isRinging && (
        <>
          <h1>Wakey Alarm</h1>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
          />
          <button onClick={handleSetAlarm}>Set Alarm</button>
          {message && <p>{message}</p>}
        </>
      )}

      {isRinging && (
        <QuestionSection 
          stopAlarm={stopAlarm} 
          weatherData={weatherData} 
          dateTime={dateTime} 
        />
      )}
    </div>
  );
};

//function for questions and the checking if the input question is correct
const QuestionSection = ({ stopAlarm, weatherData, dateTime }) => {
  const [userAnswers, setUserAnswers] = useState({ temperature: '', day: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const correctTemp = weatherData && weatherData.temperature;
    const correctDay = dateTime.day;

    if (parseInt(userAnswers.temperature) === correctTemp && userAnswers.day === correctDay) {
      setMessage('Correct! The alarm is stopped.');
      stopAlarm(); // Call stopAlarm function to stop the alarm sound
      setUserAnswers({ temperature: '', day: '' }); // Clear the input fields
    } else {
      setMessage('Incorrect! Try again.');
    }
  };

  return (
    <>
      <div>
        <h1>Answer the questions to stop the alarm!!!!</h1>

        {/*diisplay the weather info */}
        <div>
          <h2>Weather Information</h2>
          {weatherData ? (
            <div>
              <p>Temperature: {weatherData.temperature}°C</p>
              <p>Feels Like: {weatherData.feelslike}°C</p>
              <p>Weather: {weatherData.weather_descriptions[0]}</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
        {/* diisplay the Date and Time info */}
        <div>
          <h2>Date & Time Information</h2>
          {dateTime ? (
            <div>
              <p>Time: {dateTime.time}</p>
              <p>Date: {dateTime.date}</p>
              <p>Day: {dateTime.day}</p>
            </div>
          ) : (
            <p>Loading date and time...</p>
          )}
        </div>

        {/* Input fields for the user to answer the questions */}
        <div>
          <h3>What's today's temperature?</h3>
          <input
            type="number"
            placeholder='Ex: 22'
            value={userAnswers.temperature}
            onChange={(e) => setUserAnswers({ ...userAnswers, temperature: e.target.value })}
          />
        </div>

        <div>
          <h3>What day is it?</h3>
          <input
            type="text"
            placeholder='Wednesday'
            value={userAnswers.day}
            onChange={(e) => setUserAnswers({ ...userAnswers, day: e.target.value })}
          />
        </div>

        <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit & Stop</button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default App;