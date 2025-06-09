import { inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private httpClient = inject(HttpClient);
  private products = signal<any>([]);

  loadedProducts = this.products.asReadonly();

  getProducts() {
    return this.fetchProducts(
      'http://localhost:3000/products',
      'Something went wrong'
    ).pipe(
      tap({
        next: (products) => this.products.set(products),
      })
    );
  }

  private fetchProducts(url: string, errorMessage: string) {
    return this.httpClient.get<{ Products: any[] }>(url).pipe(
      map((resData) => resData.Products),
      catchError((error) => throwError(() => new Error(errorMessage)))
    );
  }
}
