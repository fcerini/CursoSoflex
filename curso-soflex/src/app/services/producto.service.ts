import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../domain/producto';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url= "producto";

  constructor(private config: ConfigService) { }

  get(): Observable<any>{
    return this.config.get(this.url);
  }

  post(data: Producto){
    return this.config.post(this.url, data)
  }

  put(id:number, data:Producto){
    return this.config.put(this.url, id, data)
  }

  delete(id:number){
    return this.config.delete(this.url, id)
  }
}
