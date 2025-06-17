import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductsService } from './services/products.service';
import { CartService } from '../cart/service/cart.service';
import { IProduct } from './models/products.model';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, EMPTY, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private cartService = inject(CartService);
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  keyword = signal('');
  isFetching = signal(false);
  isError = signal('');
  productsList = this.productsService.products; // still readonly signal

  constructor() {
    const keyword$ = toObservable(computed(() => this.keyword()));

    keyword$
      .pipe(
        switchMap((keyword) => {
          if (!keyword) {
            this.isFetching.set(true);
            return this.productsService.getProducts(keyword).pipe(
              catchError((err) => {
                this.isError.set(err.message);
                this.isFetching.set(false);
                return EMPTY;
              })
            );
          }

          return timer(700).pipe(
            switchMap(() => {
              this.isFetching.set(true);
              return this.productsService.getProducts(keyword).pipe(
                catchError((err) => {
                  this.isError.set(err.message);
                  this.isFetching.set(false);
                  return EMPTY;
                })
              );
            })
          );
        })
      )
      .subscribe({
        next: () => this.isFetching.set(false),
        complete: () => this.isFetching.set(false),
      });
  }

  onSelectProduct(product: IProduct): void {
    this.cartService.addToCart(product);
  }
}
