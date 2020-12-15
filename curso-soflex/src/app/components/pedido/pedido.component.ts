import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/domain/cliente';
import { Pedido } from 'src/app/domain/pedido';
import { ClienteService } from 'src/app/services/cliente.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ConfirmacionComponent } from '../shared/confirmacion';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  formularioOpen = false;
  detalleOpen = false;
  minDate: Date = new Date()
  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  
  columnas: string[] = ['id', 'fechaPedido', 'cliente','fecha','acciones'];
  dataSource = new MatTableDataSource<Pedido>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  form = new FormGroup({});
  index!: number;
  detaPediId: any;

  constructor(private formBuilder: FormBuilder,
              private pedidoService: PedidoService,
              private clienteService: ClienteService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      pediId: [''],
      pediFecha: ['', Validators.required],
      pediClienId: ['', Validators.required],
      pediBorrado: [''],
      pediFechaAlta: [''],
      clienNombre:['']
    });

    this.cargarClientes();
    this.cargarPedidos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarClientes(){
    this.clienteService.get().subscribe((data: any) =>{
      this.clientes = data;
    })
  }

  cargarPedidos(){
    this.pedidoService.get().subscribe((x: Pedido[]) => {
      this.pedidos = x;
      this.actualizarTabla();
    }, () => {
      console.log('Error al cargar datos desde la API');
    });
  }

  agregar(){
    this.form.reset();
    this.formularioOpen = true;
    this.index = -1
  }

  editar(pedido: Pedido){
    this.form.setValue(pedido)
    this.formularioOpen = true;
    this.detalleOpen = true;
    this.detaPediId = pedido.pediId
    this.index = this.pedidos.findIndex(elem => elem === pedido)
  }

  eliminar(pedido: Pedido){
    const dialogRef = this.dialog.open(ConfirmacionComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.pedidoService.delete(pedido.pediId).subscribe(() => {
          pedido.pediBorrado = true;
          this.pedidos = this.pedidos.filter(pedi => pedi != pedido);
          this.actualizarTabla();
        })
      }
    });
  }

  guardar(){
    if (!this.form.valid) {
      return;
    }

    let copy: Pedido = Object.assign(new Pedido(), this.form.value);

    copy.clienNombre = this.clientes.find(c => c.clienId == copy.pediClienId)!.clienNombre

    if(this.index == -1){
      this.pedidoService.post(copy).subscribe((data:any) =>{
        copy.pediId = data.pediId;
        copy.pediFechaAlta = data.pediFechaAlta;
        copy.pediBorrado = data.pediBorrado;
        this.detaPediId = data.pediId

        this.pedidos.push(copy);
        this.actualizarTabla();
        this.index = this.pedidos.findIndex(elem => elem === copy)

        this.detalleOpen = true
      })
    }else{
      this.pedidoService.put(copy.pediId, copy).subscribe((data:any)=>{
        this.pedidos[this.index] = copy;
        this.actualizarTabla();

        this.formularioOpen = false;
    })
    }
  }

  cancelar(){
    this.formularioOpen = false;
    this.detalleOpen = false;
  }

  actualizarTabla() {
    this.dataSource.data = this.pedidos;
  }

  handlerClose(close: boolean){
    this.detalleOpen = close;
    this.formularioOpen = close;
  }

  handlerUpdate(upd: boolean){
    if(upd){
      this.handlerClose(false)
      this.guardar();
    }
  }

}
