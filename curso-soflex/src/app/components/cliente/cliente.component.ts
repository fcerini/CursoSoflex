import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/domain/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

const CLIENTES: Cliente[] = [
  {clienId: 1, clienNombre: 'Nombre test 1', clienDireccion: "Calle falsa 123", clienBorrado: false, clienFechaAlta: new Date},
  {clienId: 2, clienNombre: 'Nombre test 2', clienDireccion: "Calle falsa 123", clienBorrado: false,  clienFechaAlta: new Date},
  {clienId: 3, clienNombre: 'Nombre test 3', clienDireccion: "Calle falsa 123", clienBorrado: false,  clienFechaAlta: new Date},
  {clienId: 4, clienNombre: 'Nombre test 4', clienDireccion: "Calle falsa 123", clienBorrado: false,  clienFechaAlta: new Date},
  {clienId: 5, clienNombre: 'Nombre test 5', clienDireccion: "Calle falsa 123", clienBorrado: false,  clienFechaAlta: new Date}
]

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  formularioOpen = false;
  clientes: Cliente[] = [];
  
  columnas: string[] = ['id','nombre','direccion','fecha','acciones'];
  dataSource = new MatTableDataSource<Cliente> (CLIENTES);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  form = new FormGroup({});

  constructor(private formBuilder: FormBuilder,
              private clienteService: ClienteService) { }

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
    this.formularioOpen = true;
  }

  editar(clienId: number){
    this.formularioOpen = true;
    console.log(clienId)
  }

  eliminar(clienId: number){
    console.log(clienId)
  }

  cancelar(){
    this.formularioOpen = false;
  }

  actualizarTabla() {
    this.dataSource.data = this.clientes;
  }
}
