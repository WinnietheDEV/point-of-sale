import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import { computed, signal } from '@angular/core';
import { ICartItem } from '../cart/model/cart.model';
import { CartService } from '../cart/service/cart.service';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  const mockCart = signal<ICartItem[]>([
    {
      product: { name: 'เมาส์', price: 500, stock: 10, description: '' },
      quantity: 2,
    },
    {
      product: { name: 'คีย์บอร์ด', price: 1000, stock: 5, description: '' },
      quantity: 1,
    },
  ]);

  const mockCartService = {
    cartItems: mockCart.asReadonly(),
    totalPrice: computed(() =>
      mockCart().reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('สร้าง checkout component', () => {
    expect(component).toBeTruthy();
  });

  it('แสดงปุ่ม "ชำระเงิน"', () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('ชำระเงิน');
  });

  it('แสดงยอดรวม', () => {
    const buttonElement =
      fixture.nativeElement.querySelector('#total-price-label');
    expect(buttonElement.textContent).toContain('ยอดรวม');
  });

  it('แสดงฟอร์มส่วนลด', () => {
    const buttonElement =
      fixture.nativeElement.querySelector('#discount-label');
    expect(buttonElement.textContent).toContain('ส่วนลด');
  });

  it('แสดงยอดรวม', () => {
    const buttonElement =
      fixture.nativeElement.querySelector('#total-price-label');
    expect(buttonElement.textContent).toContain('ยอดรวม');
  });

  it('แสดงยอดรวมถูกต้อง', () => {
    const totalPriceText =
      fixture.nativeElement.querySelector('#total-price-value')?.textContent;
    expect(totalPriceText).toContain('2,000');
  });

  it('แสดงยอดสุทธิถูกต้องหลังจากหักส่วนลด', () => {
    component.discount.set('1,500.00');
    fixture.detectChanges();

    const grandTotalText =
      fixture.nativeElement.querySelector('#grand-total-value')?.textContent;

    expect(grandTotalText).toContain('500.00');
  });

  it('ปุ่มชำระเงินถูก disabled ถ้าตะกร้าว่าง', () => {
    mockCart.set([]);
    fixture.detectChanges();

    expect(component.isDisabledCheckoutButton).toBeTrue();

    const button = fixture.nativeElement.querySelector('#checkout-button');
    expect(button.disabled).toBeTrue();
  });
});
