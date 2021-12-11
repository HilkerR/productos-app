import { Component, OnInit } from '@angular/core';
import { Producto } from './producto';
import { ProductoService } from './producto.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  })
  export class ProductosComponent implements OnInit {

    productos: Producto[];
    paginador: any;
    productoSeleccionado: Producto;

    constructor(private productoService: ProductoService,

      private activatedRoute: ActivatedRoute,) { }

    ngOnInit() {

      this.activatedRoute.paramMap.subscribe(params => {
        let page: number = +params.get('page');

        if (!page) {
          page = 0;
        }

        this.productoService.getProductos(page)
          .pipe(
            tap(response => {
              console.log('ProductosComponent: tap 3');
              (response.content as Producto[]).forEach(producto => console.log(producto.nombre));
            })
          ).subscribe(response => {
            this.productos = response.content as Producto[];
            this.paginador = response;
          });
      });

    }

    delete(producto: Producto): void {
      swal({
        title: 'Está seguro?',
        text: `¿Seguro que desea eliminar ${producto.nombre}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true
      }).then((result) => {
        if (result.value) {

          this.productoService.delete(producto.id).subscribe(
            () => {
              this.productos = this.productos.filter(cli => cli !== producto)
              swal(
                'producto Eliminado!',
                `producto ${producto.nombre} eliminado con éxito.`,
                'success'
              )
            }
          )

        }
      });
    }

  }
