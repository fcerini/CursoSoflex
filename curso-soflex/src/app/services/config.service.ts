import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  api = "/curso-soflex_api/index.php/";
  server = '';
  user = JSON.parse(localStorage.getItem("Authorization")!);
  httpOptions!: { headers: HttpHeaders; };

  constructor(private http: HttpClient) {
    this.server = 'http://localhost:8080' + this.api

    if(this.user){
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.user.token
        })
      };
    }
  }

  get(url: string){
    return this.http.get(this.server + url, this.httpOptions).pipe(catchError(this.handleError));
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

  public handleError(err: Response){
    return throwError(err.toString());
  }
}
