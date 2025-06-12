import { inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../environements/environement';
import { ICartItem } from '../model/cart.model';
import { IProduct } from '../../products/models/products.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = signal<ICartItem[]>([]);
  cartItems = this.cart.asReadonly();

  addToCart(product: IProduct): void {
    const item = this.cart().find((item) => item.product._id === product._id);
    console.log('product', product);
    if (item) {
      if (item.quantity < product.stock) {
        item.quantity++;
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    } else {
      this.cart.update((currentCart) => [
        ...currentCart,
        { product, quantity: 1 },
      ]);
    }
  }
}
