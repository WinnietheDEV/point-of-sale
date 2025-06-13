import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  formatMoneyInput,
  unformatMoneyString,
} from '../../utils/number-format.util';
import { CartService } from '../cart/service/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  discount = signal<string>('0');
  private cartService = inject(CartService);
  readonly totalPrice = this.cartService.totalPrice;
  grandTotal = computed(() => {
    const discount = unformatMoneyString(this.discount());
    return this.totalPrice() - discount;
  });
  readonly isDisabledCheckoutButton =
    this.cartService.cartItems().length < 1 || this.grandTotal() < 0;

  onDiscountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatMoneyInput(input.value, this.discount());
    input.value = formatted;
    this.discount.set(formatted);
  }
}
