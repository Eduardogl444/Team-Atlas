import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = process.env.API_KEY;

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

class WeatherService {
  // Fetch weather data for a city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const locationData = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(locationData);
    return this.parseWeatherData(weatherData, city);
  }

  // Fetch location data from city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const { lat, lon } = response.data[0];
    return { lat, lon };
  }

  // Fetch weather data for given coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await axios.get(baseURL, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        appid: apiKey,
        units: 'imperial',
      },
    });
    return response.data;
  }

  // Parse weather data into a usable format
  private parseWeatherData(data: any, city: string): Weather[] {
    const current = data.list[0];
    const forecast = data.list.slice(1, 6); // Next 5 intervals

    return [
      {
        city,
        date: new Date(current.dt * 1000).toLocaleDateString(),
        icon: current.weather[0].icon,
        iconDescription: current.weather[0].description,
        tempF: current.main.temp,
        windSpeed: current.wind.speed,
        humidity: current.main.humidity,
      },
      ...forecast.map((day: any) => ({
        city,
        date: new Date(day.dt * 1000).toLocaleDateString(),
        icon: day.weather[0].icon,
        iconDescription: day.weather[0].description,
        tempF: day.main.temp,
        windSpeed: day.wind.speed,
        humidity: day.main.humidity,
      })),
    ];
  }
}

export default new WeatherService();

