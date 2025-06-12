import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { ICartItem } from './model/cart.model';
import { signal } from '@angular/core';
import { CartService } from './service/cart.service';
import { By } from '@angular/platform-browser';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const mockCart: ICartItem[] = [
    {
      product: { _id: '1', name: 'iPhone', stock: 120, price: 999, ordered: 0 },
      quantity: 1,
    },
  ];

  let mockCartSignal = signal<ICartItem[]>(mockCart);

  const mockCartService = {
    cartItems: mockCartSignal.asReadonly(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('สร้าง cart component', () => {
    expect(component).toBeTruthy();
  });

  it('แสดงรายการสินค้าที่อยู่ในตะกร้า', () => {
    const cartItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(cartItems.length).toBe(1);
    const firstCardText = cartItems[0].nativeElement.textContent;
    expect(firstCardText).toContain('iPhone');
    expect(firstCardText).toContain('1');
  });
});
