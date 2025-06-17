import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CheckoutService } from '../service/checkout.service';
import { CartService } from '../../cart/service/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-modal',
  imports: [CurrencyPipe],
  templateUrl: './checkout-modal.component.html',
  styleUrl: './checkout-modal.component.css',
})
export class CheckoutModalComponent implements OnInit {
  paymentMethod = signal<string>('เงินสด');
  @Input() grandTotal: number = 0;
  pay: number = 0;
  change = signal<number>(0);
  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);
  @Input() onCloseCheckoutModal!: () => void;

  ngOnInit() {
    this.pay = this.grandTotal;
    this.change.set(this.pay - this.grandTotal);
  }

  onMakeTransaction() {
    this.checkoutService
      .makeTransaction({
        products: this.cartService.cartItems(),
        grandTotal: this.grandTotal,
        pay: this.pay,
        change: this.change(),
        paymentMethod: this.paymentMethod() === 'เงินสด' ? 'cash' : '',
      })
      .subscribe({
        next: (res) => {
          this.cartService.clearCart();
          this.onCloseCheckoutModal();
          alert('ชำระเงินสำเร็จ');
        },
        error: (err) => {
          console.error('Transaction failed:', err.message);
          this.onCloseCheckoutModal();
          alert('ชำระเงินไม่สำเร็จ');
        },
      });
  }
}
