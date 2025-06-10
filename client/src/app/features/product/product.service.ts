import { inject, Injectable, signal } from '@angular/core';
import { IProduct } from '../products/models/products.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private product = signal<IProduct | undefined>(undefined);
  private httpClient = inject(HttpClient);

  loadedProduct = this.product.asReadonly();

  getProducts(id: string) {
    return this.fetchProduct(
      `${environment.backendUrl}/products/${id}`,
      'Something went wrong'
    ).pipe(
      tap({
        next: (product) => {
          this.product.set(product);
        },
      })
    );
  }

  private fetchProduct(url: string, errorMessage: string) {
    return this.httpClient.get<IProduct>(url).pipe(
      map((product) => product),
      catchError((error) => throwError(() => new Error(errorMessage)))
    );
  }
}
