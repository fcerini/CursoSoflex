import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/domain/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ConfirmacionComponent } from '../shared/confirmacion';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  formularioOpen = false;
  clientes: Cliente[] = [];
  
  columnas: string[] = ['id','nombre','direccion','fecha','acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  form = new FormGroup({});
  index!: number;

  constructor(private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      clienId: [''],
      clienNombre: ['', Validators.required], 
      clienDireccion: ['', Validators.required],
      clienBorrado: [''],
      clienFechaAlta: ['']
    });

    this.cargarClientes()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarClientes(){
    this.clienteService.get().subscribe((x: Cliente[]) => {
      this.clientes = x;
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

  editar(cliente: Cliente){
    this.form.setValue(cliente)
    this.formularioOpen = true;
    this.index = this.clientes.findIndex(elem => elem === cliente)
  }

  eliminar(cliente: Cliente){
    const dialogRef = this.dialog.open(ConfirmacionComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clienteService.delete(cliente.clienId).subscribe(() => {
          cliente.clienBorrado = true;
          this.clientes = this.clientes.filter(cli => cli != cliente);
          this.actualizarTabla();
        })
      }
    });
  }

  guardar(){
    if (!this.form.valid) {
      return;
    }

    this.formularioOpen = false;
    let copy: Cliente = Object.assign(new Cliente(), this.form.value)

    if(this.index == -1){
      this.clienteService.post(copy).subscribe((data:any) =>{
        copy.clienId = data.clienId;
        copy.clienFechaAlta = data.clienFechaAlta;
        copy.clienBorrado = data.clienBorrado;

        this.clientes.push(copy);
        this.actualizarTabla();
      })
    }else{
      this.clienteService.put(copy.clienId, copy).subscribe((data:any)=>{
        this.clientes[this.index] = copy;
        this.actualizarTabla();
      })
    }
  }

  cancelar(){
    this.formularioOpen = false;
  }

  actualizarTabla() {
    this.dataSource.data = this.clientes;
  }
}
