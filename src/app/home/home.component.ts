import { Component } from '@angular/core';
import City from './../entities/city';
import WeatherService from './../services/weather.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
  providers: [WeatherService]
})
export class HomeComponent {
  public cities: City[];
  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    let ids = [
      1816670,  //Beijing
      2800866,  //Brussels
      5128638   //New York 
    ];

    this.weatherService.load(ids).then((cities) => {
      this.cities = cities;
    });
  }

}
