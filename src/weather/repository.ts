import config from "config";
import PostgreSQL, { Pool } from "pg";
import { WeatherData, WeatherDataSchema } from "./dto.js";

const poolConfig = config.get<PostgreSQL.PoolConfig>("database");

export class WeatherDataRepository {
  private pool: Pool;

  constructor() {
    const poolConfig = config.get('database');
    this.pool = new Pool(poolConfig!);
  }

  async createTable(): Promise<void> {
    const query = `
            CREATE TABLE IF NOT EXISTS weather (
                location VARCHAR(256),
                date DATE,
                temperature DECIMAL,
                humidity DECIMAL,
                PRIMARY KEY(location, date)
            );
            CREATE INDEX IF NOT EXISTS idx_location ON weather(location);
            CREATE INDEX IF NOT EXISTS idx_date ON weather(date);
        `;
    await this.pool.query(query);
  }
  

  async insertWeatherData(weatherData: WeatherData): Promise<void> {
    const query = `
            INSERT INTO weather (location, date, temperature, humidity)
            VALUES ($1, $2, $3, $4)
        `;

    const values = [
      weatherData.location,
      weatherData.date,
      weatherData.temperature,
      weatherData.humidity,
    ];
    await this.pool.query(query, values);
  }

  async getWeatherDataByLocation(
    location: string,
    searchedValues: string,
    from?: string,
    to?: string
  ): Promise<WeatherData[] | null> {
    const validSearchValues = [
      "location",
      "date",
      "temperature",
      "humidity",
    ];
    if (!validSearchValues.includes(searchedValues)) {
      throw new Error("Invalid search value");
    }

    let query = `
      SELECT ${searchedValues} 
      FROM weather 
      WHERE location = $1
    `;
    const params = [location];

    if (from) {
      query += ` AND date >= $${params.length + 1}`;
      params.push(from);
    }

    if (to) {
      query += ` AND date <= $${params.length + 1}`;
      params.push(to);
    }
    try {
      const result: PostgreSQL.QueryResult = await this.pool.query(
        query,
        params
      );
      if (result.rows.length === 0) return null;
      return result.rows.map((row) =>
        WeatherDataSchema.parse(row)
      ) as WeatherData[];
    } catch (error) {
      console.error("Error in getWeatherDataByLocation: ", error);
      throw error;
    }
  }

  async getAllWeatherData(): Promise<WeatherData[]> {
    const query = "SELECT location, date, temperature, humidity FROM weather";
    const result: PostgreSQL.QueryResult = await this.pool.query(query);
    return result.rows as WeatherData[];
  }
}

export default new WeatherDataRepository();
