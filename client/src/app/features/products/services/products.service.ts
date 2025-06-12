import { inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { IProduct } from '../models/products.model';
import { environment } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private httpClient = inject(HttpClient);
  private _products = signal<IProduct[]>([]);
  products = this._products.asReadonly();

  getProducts() {
    return this.fetchProducts(
      `${environment.backendUrl || 'http://localhost:3000'}/products`,
      'Something went wrong'
    ).pipe(
      tap({
        next: (products) => {
          this._products.set(products);
        },
      })
    );
  }

  private fetchProducts(url: string, errorMessage: string) {
    return this.httpClient.get<IProduct[]>(url).pipe(
      map((products) => products),
      catchError((error) => throwError(() => new Error(errorMessage)))
    );
  }
}
