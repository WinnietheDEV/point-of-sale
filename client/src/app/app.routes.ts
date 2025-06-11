import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'carts', component: CartComponent },
  { path: '**', component: NotFoundComponent },
];
