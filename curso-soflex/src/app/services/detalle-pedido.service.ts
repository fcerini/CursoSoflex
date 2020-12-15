import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetallePedido } from '../domain/detalle-pedido';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoService {

  url= "detalle-pedido";

  constructor(private config: ConfigService) { }

  get(pedidoId: number): Observable<any>{
    return this.config.getById(this.url, pedidoId);
  }

  post(data: DetallePedido){
    return this.config.post(this.url, data)
  }

  put(id:number, data: DetallePedido){
    return this.config.put(this.url, id, data)
  }

  delete(id: number){
    return this.config.delete(this.url, id)
  }
}
