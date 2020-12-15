import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/domain/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ConfirmacionComponent } from '../shared/confirmacion';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  formularioOpen = false;
  productos: Producto[] = [];
  
  columnas: string[] = ['id','descripcion','precio','fecha','acciones'];
  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  form = new FormGroup({});
  index!: number;

  constructor(private formBuilder: FormBuilder,
              private productoService: ProductoService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      prodId: [''],
      prodDescripcion: ['', Validators.required], 
      prodPrecio: ['', Validators.required],
      prodBorrado: [''],
      prodFechaAlta: ['']
    });

    this.cargarProductos()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarProductos(){
    this.productoService.get().subscribe((x: Producto[]) => {
      this.productos = x;
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

  editar(Producto: Producto){
    this.form.setValue(Producto)
    this.formularioOpen = true;
    this.index = this.productos.findIndex(elem => elem === Producto)
  }

  eliminar(Producto: Producto){
    const dialogRef = this.dialog.open(ConfirmacionComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.productoService.delete(Producto.prodId).subscribe(() => {
          Producto.prodBorrado = true;
          this.productos = this.productos.filter(cli => cli != Producto);
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
    let copy: Producto = Object.assign(new Producto(), this.form.value)

    if(this.index == -1){
      this.productoService.post(copy).subscribe((data:any) =>{
        copy.prodId = data.prodId;
        copy.prodFechaAlta = data.prodFechaAlta;
        copy.prodBorrado = data.prodBorrado;

        this.productos.push(copy);
        this.actualizarTabla();
      })
    }else{
      this.productoService.put(copy.prodId, copy).subscribe((data:any)=>{
        this.productos[this.index] = copy;
        this.actualizarTabla();
      })
    }
  }

  cancelar(){
    this.formularioOpen = false;
  }

  actualizarTabla() {
    this.dataSource.data = this.productos;
  }

}
