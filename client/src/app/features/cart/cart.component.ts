import { Component, inject } from '@angular/core';
import { CartService } from './service/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);
  readonly itemsInCart = this.cartService.cartItems;
}
