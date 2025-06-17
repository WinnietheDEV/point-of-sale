import { computed, Injectable, signal } from '@angular/core';
import { ICartItem } from '../model/cart.model';
import { IProduct } from '../../products/models/products.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart = signal<ICartItem[]>([]);
  cartItems = this._cart.asReadonly();
  totalPrice = computed(() =>
    this._cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addToCart(product: IProduct): void {
    const newCartItem: ICartItem = { ...product, quantity: 1 };
    const itemIndex = this._cart().findIndex(
      (item) => item._id === newCartItem._id
    );
    if (itemIndex !== -1) {
      const currentCart = [...this._cart()];
      const item = currentCart[itemIndex];

      if (item.quantity < item.stock) {
        currentCart[itemIndex] = {
          ...item,
          quantity: item.quantity + 1,
        };
        this._cart.set(currentCart);
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    } else {
      if (newCartItem.stock >= 1) {
        this._cart.update((cart) => [...cart, { ...newCartItem }]);
      } else {
        alert('สินค้าเกินจำนวนในสต็อก');
      }
    }
  }

  clearCart() {
    this._cart.set([]);
  }
}
