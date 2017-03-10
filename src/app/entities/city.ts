import Weather from './weather';
import Measurement from './measurement';

export default class City {
    public id: number;
    public name: string;    
    public measurement: Measurement;
    public weather: Weather[];

    constructor(data?: any) {
        this.id = data.id;
        this.name = data.name;
        this.measurement = new Measurement(data.main);
        this.weather = data.weather.map((w) => {
            return new Weather(w);
        });        
    }
}