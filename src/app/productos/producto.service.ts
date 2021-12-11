import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  private urlEndPoint: string = 'http://localhost:8080/api/productos';

  constructor(public http: HttpClient, public router: Router) { }


  getProductos(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ProductoService: tap 1');
        (response.content as Producto[]).forEach(producto => console.log(producto.nombre));
      }),
      map((response: any) => {
        (response.content as Producto[]).map(producto => {
          producto.nombre = producto.nombre.toUpperCase();
          return producto;
        });
        return response;
      }),
      tap(response => {
        console.log('ProductoService: tap 2');
        (response.content as Producto[]).forEach(producto => console.log(producto.nombre));
      }));
  }

  create(producto: Producto): Observable<Producto> {
    return this.http.post(this.urlEndPoint, producto)
      .pipe(
        map((response: any) => response.producto as Producto),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  getProducto(id): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  update(producto: Producto): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${producto.id}`, producto).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  delete(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }


}
