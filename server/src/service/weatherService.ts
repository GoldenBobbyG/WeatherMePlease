import dotenv from 'dotenv';
//import { error } from 'node:console';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  
  constructor(city: string,date: string, icon: string,iconDescription: string, tempF: number,windSpeed: number,humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL?: string;
  apiKey?: string;
  cityName?: string;

  constructor(cityName: string) {
    this.baseURL = 'https://api.openweathermap.org';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = cityName;

    console.log("Weather API Response", this.apiKey);

  }

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.log('Error fetching location data:', error);
      return { error: 'Failed to fetch location data' };
    }
  }
  
    
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    try {
    const { lat, lon } = locationData;
    return { lat, lon };
    } catch (error) {
      console.log('Error destructuring location data:', error);
      return { lat: 0, lon: 0 };
    }
      
    
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    try {
      return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    } catch (error) {
      console.log('Error building geocode query:', error);
      return '';
      
    }
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}

  private buildWeatherQuery(coordinates: Coordinates): string {
    try {
      const { lat, lon } = coordinates;
      return `${this.baseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;
    } catch (error) {
      console.log('Error building weather query:', error);
      return '';
      
    }

  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}

  private async fetchAndDestructureLocationData(){
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return await response.json();
    } catch (error) {
      console.log('Error fetching weather data:', error);
      return { error: 'Failed to fetch weather data' };
    }
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) 
  private parseCurrentWeather(response: any) {
    try {
      const city = this.cityName || 'Unknown City';
      const date = new Date(response.current.dt * 1000).toLocaleDateString();
      const icon = response.current.weather[0].icon;
      const iconDescription = response.current.weather[0].description;
      const tempF = response.current.temp;
      const windSpeed = response.current.wind_speed;
      const humidity = response.current.humidity;
      return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
    } catch (error: unknown) {
      console.log('Error parsing current weather:', error);
      return null;
      
    }
  }
  // TODO: Complete buildForecastArray method
// private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
  const forecastArray = weatherData.map((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const icon = day.weather[0].icon;
    const iconDescription = day.weather[0].description;
    const tempF = day.temp.day;
    const windSpeed = day.wind_speed;
    const humidity = day.humidity;
    return new Weather(currentWeather.city, date, icon, iconDescription, tempF, windSpeed, humidity);
  });
  return forecastArray;
  }


// TODO: Complete getWeatherForCity method
// async getWeatherForCity(city: string) {}

async getWeatherForCity(city: string){
  try {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) throw new Error('Invalid location data');

    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    if (!currentWeather) throw new Error('Failed to parse current weather');

    const forecastData = weatherData.daily;
    const forecast = this.buildForecastArray(currentWeather, forecastData);
    return [currentWeather, ...forecast];
  } catch (error: unknown) {
    console.log('Error fetching weather for city:', error);
    return[];
  }
}
}




export default new WeatherService('defaultCityName');