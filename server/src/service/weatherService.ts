import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;

  constructor(temperature: number, humidity: number, windSpeed: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private apiKey: string = process.env.API_KEY || ''; // Fetch API key from environment variables
  private cityName: string = '';
  private baseURL: string = 'https://api.openweathermap.org/data/2.5';

  // TODO: Create fetchLocationData method 
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return await response.json();
  }
 
  // TODO: Create destructureLocationData method
 // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: any): Coordinates {
    const {coord} = locationData.results[0].geometry.location;
    return {
      latitude: coord.lat,
      longitude: coord.lon,
    };
  }
  

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    return encodeURIComponent(this.cityName);
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(`${this.baseURL}/weather?${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const { temp, humidity } = response.main;
    const { speed: windSpeed } = response.wind;
    const { description } = response.weather[0];
    return new Weather(temp, humidity, windSpeed, description);
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  //check the underscore in the parameter
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]) {
    return weatherData.map((data: any) => {
    const { temp, humidity } = data.main;
    const { speed: windSpeed } = data.wind;
    const { description } = data.weather[0];
    return new Weather(temp, humidity, windSpeed, description);
    });
    
  }
  // TODO: Complete getWeatherForCity method
  
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherResponse);
    
    const forecastResponse = await fetch(`${this.baseURL}/forecast?${this.buildWeatherQuery(coordinates)}`);
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    const forecastData = await forecastResponse.json();
    const forecast = this.buildForecastArray(currentWeather, forecastData.list);
    return { currentWeather, forecast };
  }
  
}

export default new WeatherService();
