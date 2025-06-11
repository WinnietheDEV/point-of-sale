import { Component } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-main',
  imports: [ProductsComponent, CartComponent, CheckoutComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
