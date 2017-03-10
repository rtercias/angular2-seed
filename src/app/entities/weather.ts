export default class Weather {
    public id: number;
    public main: string;
    public description: string;
    public icon: string;

    constructor(data?: any) {
        this.id = data.id;
        this.main = data.main;
        this.description = data.description;
        this.icon = data.icon;
    }
}