import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../domain/cliente';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url= "cliente";

  constructor(private config: ConfigService) { }

  get(): Observable<any>{
    return this.config.get(this.url);
  }

  post(data: Cliente){
    return this.config.post(this.url, data)
  }

  put(id:number, data:Cliente){
    return this.config.put(this.url, id, data)
  }

  delete(id:number){
    return this.config.delete(this.url, id)
  }
}
