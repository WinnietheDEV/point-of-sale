import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ProductComponent } from './features/product/product.component';
import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'carts', component: CartComponent },
  { path: '**', component: NotFoundComponent },
];
