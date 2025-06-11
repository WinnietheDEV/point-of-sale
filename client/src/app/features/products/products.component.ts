import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe, formatNumber } from '@angular/common';
import { ProductsService } from './services/products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  products = this.productsService.loadedProducts;

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.productsService.getProducts().subscribe({
      error: (error: Error) => {
        this.isFetching.set(false);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
