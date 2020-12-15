import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  api = "/curso-soflex_api/index.php/";
  server = '';

  constructor(private http: HttpClient) {
    this.server = 'http://localhost:8080' + this.api
  }

  get(url: string){
    return this.http.get(this.server + url);
  }

  getById(url: string, id: number){
    return this.http.get(this.server + url + '/' + id);
  }

  post(url:string, data: any){
    return this.http.post(this.server + url, data)
  }

  put(url:string, id:number, data:any){
    return this.http.put(this.server + url + '/' + id, data)
  }

  delete(url:string, id:number){
    return this.http.delete(this.server + url + '/' + id)
  }
}
