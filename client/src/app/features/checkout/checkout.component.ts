import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatMoneyInput } from '../../utils/number-format.util';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  discount = '0';

  onDiscountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatMoneyInput(input.value, this.discount);
    input.value = formatted;
    this.discount = formatted;
  }
}
