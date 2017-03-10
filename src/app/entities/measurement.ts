export default class Measurement {
    public temp: number;
    public pressure: number;
    public humidity: number;
    public temp_min: number;
    public temp_max: number;
    public unit: string;

    constructor(data?: any) {
        this.temp = data.temp;
        this.pressure = data.pressure;
        this.humidity = data.humidity;
        this.temp_min = data.temp_min;
        this.temp_max = data.temp_max;
        this.unit = data.unit;        
    }
}