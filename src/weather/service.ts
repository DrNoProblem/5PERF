import dayjs from "dayjs";
import { WeatherData, WeatherFilter } from "./dto.js";
import repositoryInstance, { WeatherDataRepository } from "./repository.js";

export class WeatherService {
  private weatherRepository: WeatherDataRepository;
  constructor() {
    this.weatherRepository = repositoryInstance;
  }

  async addData(data: WeatherData) {
    return this.weatherRepository.insertWeatherData(data);
  }

  async getData(location: string, options: WeatherFilter, searchedValues: string) {
    const { from, to } = options;
    
    const formattedFrom = from ? dayjs(from).format('YYYY-MM-DD') : undefined;
    const formattedTo = to ? dayjs(to).format('YYYY-MM-DD') : undefined;
  
    return this.weatherRepository.getWeatherDataByLocation(location, searchedValues, formattedFrom, formattedTo);
  }
  async getMean(location: string, options: WeatherFilter) {
    const data = await this.getData(location, options, 'AVG(temperature) as mean');
    return data && data.length > 0 ? data[0].temperature : null;
  }
  

  async getMax(location: string, options: WeatherFilter) {
    const data = await this.getData(location, options, 'MAX(temperature) as max');
    return data && data.length > 0 ? data[0].temperature : null;
  }
  

  async getMin(location: string, options: WeatherFilter) {
    const data = await this.getData(location, options, 'MIN(temperature) as min');
    return data && data.length > 0 ? data[0].temperature : null;
  }
  
}

export default new WeatherService();
