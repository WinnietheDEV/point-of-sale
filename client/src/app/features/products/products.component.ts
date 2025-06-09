import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  isFetching = signal(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  places = this.productsService.loadedProducts;
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.productsService.getProducts().subscribe({
      error: (error: Error) => {
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
