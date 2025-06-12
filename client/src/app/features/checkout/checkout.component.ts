import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatMoneyInput } from '../../utils/number-format.util';
import { CartService } from '../cart/service/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  discount = '0';
  private cartService = inject(CartService);
  readonly totalPrice = this.cartService.totalPrice;

  onDiscountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatMoneyInput(input.value, this.discount);
    input.value = formatted;
    this.discount = formatted;
  }
}
