import { computed, effect, Injectable, signal } from '@angular/core';
import { ICartItem } from '../model/cart.model';
import { IProduct } from '../../products/models/products.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart = signal<ICartItem[]>([]);
  cartItems = this._cart.asReadonly();
  totalPrice = computed(() =>
    this._cart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  addToCart(product: IProduct): void {
    const itemIndex = this._cart().findIndex(
      (item) => item.product._id === product._id
    );
    if (itemIndex !== -1) {
      const currentCart = [...this._cart()];
      const item = currentCart[itemIndex];

      if (item.quantity < item.product.stock) {
        currentCart[itemIndex] = {
          ...item,
          quantity: item.quantity + 1,
        };
        this._cart.set(currentCart);
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    } else {
      if (product.stock >= 1) {
        this._cart.update((cart) => [...cart, { product, quantity: 1 }]);
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    }
  }
}
