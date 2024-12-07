import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const historyPath = path.join(__dirname, '../db/searchHistory.json');

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  // Read from searchHistory.json
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyPath, 'utf-8');
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  }

  // Write to searchHistory.json
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(historyPath, JSON.stringify(cities, null, 2));
  }

  // Get cities from searchHistory.json
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // Add a city to searchHistory.json
  async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), name);
    cities.push(newCity);
    await this.write(cities);
  }

  // Remove a city from searchHistory.json
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();

