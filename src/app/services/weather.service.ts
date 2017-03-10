import { RequestOptionsArgs } from '@angular/http/src/interfaces';
import { cache } from 'rxjs/operator/cache';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import City from './../entities/city';

@Injectable()
export default class WeatherService {
  private appId = 'cab4e299abff5d6eeadd8dd9492408cf';
  private units = 'english';
  constructor (private http: Http) {}

  public load(cityIds: number[]) {
    const oneHour = 30*1000;
    const cityIdString =cityIds.join(',');     

    // TODO: replace with OpenWeatherMap url when service is working properly.
    // Currently, the free version of the API does not appear to be working, 
    // and my registered APPID is being rejected.
    // const url = `http://samples.openweathermap.org/data/2.5/group?id=${cityIdString}&units=${this.units}&APPID=${this.appId}`;

    // As a work-around, I captured the sample json data from OpenWeatherMap
    // and stored it in a local file, replacing the three sample city names
    // with those required in the instruction.
    const url = './app/services/weather.json';
    
    if (this.isCacheExpired()) {
      console.log('Getting data from API');
      return this.http.get(url).toPromise().then((response) => {
        let data = response.json();
        this.setCache('weather', JSON.stringify(data));
        this.setCache('weather-timeout', Date.now() + oneHour);        
        return data.list.map((item) => new City(item));
      });
    } else {
      console.log('Getting data from cache');
      return new Promise((resolve, reject) => {
        try {
          let data = this.getCache('weather');
          resolve(data.list.map((item) => new City(item)));
        } catch(e) {           
          this.expireCache('weather');
          this.expireCache('weather-timeout');
          reject('Unable to get cached data');         
        }
      });
    }
  }

  private setCache(key, data) {
    return sessionStorage.setItem(key, data);
  }

  private getCache(key) {
    let data = sessionStorage.getItem(key);
    return JSON.parse(data);    
  }

  private expireCache(key) {
    sessionStorage.removeItem(key);
  }

  private isCacheExpired() {
    let timeout = parseInt(this.getCache('weather-timeout')) || Date.now();
    return timeout <= Date.now();
  }
}