import fs from 'fs/promises';
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

/*
  fetch()
    .then(resposne => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))


*/

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const filePath = './db/db.json';
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const cities = JSON.parse(data);
      return cities.map((city: any) => new City(city.id, city.name));
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }
  // private async read() {}
  private async write(cities: City[]): Promise<void> {
    const filePath = './db/db.json';
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(filePath, data, 'utf-8');
    } catch (error) {
      console.error('Error writing search history:', error);
    }
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(city: City): Promise<void> {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }

  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
