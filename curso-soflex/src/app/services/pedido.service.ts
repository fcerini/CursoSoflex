import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../domain/pedido';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  url= "pedido";

  constructor(private config: ConfigService) { }

  get(): Observable<any>{
    return this.config.get(this.url);
  }

  post(data: Pedido){
    return this.config.post(this.url, data)
  }

  put(id:number, data:Pedido){
    return this.config.put(this.url, id, data)
  }

  delete(id:number){
    return this.config.delete(this.url, id)
  }
}
