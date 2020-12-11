import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { DetallePedidoComponent } from './components/detalle-pedido/detalle-pedido.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { ProductoComponent } from './components/producto/producto.component';

const routes: Routes = [
  { path: 'clientes', component: ClienteComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'pedidos', component: PedidoComponent },
  { path: 'detalle-pedido', component: DetallePedidoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
