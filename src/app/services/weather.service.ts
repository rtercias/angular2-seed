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
  private units = 'imperial';
  private corsPrefix = 'https://cors-anywhere.herokuapp.com/';

  constructor (private http: Http) {}

  public load(cityIds: number[]) {
    const oneHour = 30*1000;
    const cityIdString =cityIds.join(',');
    const serviceUrl = 'http://api.openweathermap.org/data/2.5/group';
    const url = `${serviceUrl}?id=${cityIdString}&units=${this.units}&APPID=${this.appId}`;
    
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