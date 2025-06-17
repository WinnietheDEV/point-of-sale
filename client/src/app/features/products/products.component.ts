import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductsService } from './services/products.service';
import { CartService } from '../cart/service/cart.service';
import { ICartItem } from '../cart/model/cart.model';
import { IProduct } from './models/products.model';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  isFetching = signal(false);
  isError = signal('');
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  productsList = this.productsService.products;

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.productsService.getProducts().subscribe({
      error: (error: Error) => {
        this.isFetching.set(false);
        this.isError.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectProduct(product: IProduct): void {
    this.cartService.addToCart(product);
  }
}
