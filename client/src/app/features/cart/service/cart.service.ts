import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../../environements/environement';
import { ICartItem } from '../model/cart.model';
import { IProduct } from '../../products/models/products.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart = signal<ICartItem[]>([]);
  cartItems = this._cart.asReadonly();
  grandTotal = computed(() =>
    this._cart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  addToCart(product: IProduct): void {
    const item = this._cart().find((item) => item.product._id === product._id);
    if (item) {
      if (item.quantity < product.stock) {
        item.quantity++;
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    } else {
      if (product.stock >= 1) {
        this._cart.update((currentCart) => [
          ...currentCart,
          { product, quantity: 1 },
        ]);
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    }
  }
}
