import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  formatMoneyInput,
  unformatMoneyString,
} from '../../utils/number-format.util';
import { CartService } from '../cart/service/cart.service';
import { CurrencyPipe } from '@angular/common';
// test change git user
@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  readonly totalPrice = this.cartService.totalPrice;
  discount = signal<string>('0');
  grandTotal = computed(() => {
    const discount = unformatMoneyString(this.discount());
    return this.totalPrice() - discount;
  });
  readonly isDisabledCheckoutButton = computed(() => {
    return this.cartService.cartItems().length < 1 || this.grandTotal() < 0;
  });
  isCheckoutModalOpen = signal(false);

  onOpenCheckoutModal() {
    this.isCheckoutModalOpen.set(true);
  }

  onDiscountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatMoneyInput(input.value, this.discount());
    input.value = formatted;
    this.discount.set(formatted);
  }
}
