import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { CartComponent } from './features/cart/cart.component';
import { MainComponent } from './features/main/main.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: '**', redirectTo: '', pathMatch: 'prefix' },
];
