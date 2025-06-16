import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CheckoutModalComponent } from './checkout-modal.component';
import { CartService } from '../../cart/service/cart.service';
import { ICartItem } from '../../cart/model/cart.model';
import { CheckoutService } from '../service/checkout.service';

describe('CheckoutModalComponent', () => {
  let component: CheckoutModalComponent;
  let fixture: ComponentFixture<CheckoutModalComponent>;
  let mockCheckoutService: jasmine.SpyObj<CheckoutService>;

  const mockCart = signal<ICartItem[]>([
    {
      _id: '3788392',
      name: 'เมาส์',
      price: 500,
      stock: 10,
      quantity: 1,
    },
    {
      _id: '1210929',
      name: 'คีย์บอร์ด',
      price: 1000,
      stock: 5,
      quantity: 1,
    },
  ]);

  const mockCartService = {
    cartItems: mockCart.asReadonly(),
    clearCart: jasmine.createSpy('clearCart'),
  };

  beforeEach(() => {
    mockCheckoutService = jasmine.createSpyObj('CheckoutService', [
      'makeTransaction',
    ]);

    mockCheckoutService.makeTransaction.and.returnValue(
      of({
        products: mockCartService.cartItems(),
        grandTotal: 1500,
        pay: 1500,
        change: 0,
        paymentMethod: 'เงินสด',
      })
    );

    TestBed.configureTestingModule({
      imports: [CheckoutModalComponent],
      providers: [
        { provide: CheckoutService, useValue: mockCheckoutService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutModalComponent);
    component = fixture.componentInstance;
  });

  it('รับค่าราคาสุทธิในการชำระเงิน', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    expect(component.grandTotal).toBe(1500);
  });

  it('กำหนดให้จำนวนที่ชำระพอดีกับราคาสุทธิ', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    expect(component.pay).toBe(1500);
  });

  it('คำนวณเงินทอนจากจำนวนที่ชำระ - ราคาสุทธิ', () => {
    component.grandTotal = 1500;
    expect(component.change()).toBe(0);
  });

  it('ทำรายการชำระเงินและปิด checkout modal เมื่อสั่ง onMakeTransaction', () => {
    const closeModal = jasmine.createSpy();
    component.onCloseCheckoutModal = closeModal;

    component.grandTotal = 1500;
    component.paymentMethod.set('เงินสด');
    fixture.detectChanges();
    component.onMakeTransaction();

    expect(mockCheckoutService.makeTransaction).toHaveBeenCalledWith({
      products: mockCartService.cartItems(),
      grandTotal: 1500,
      pay: 1500,
      change: 0,
      paymentMethod: 'cash',
    });

    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });

  it('แสดงราคาสุทธิ', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    const grandTotalEl = fixture.debugElement.query(
      By.css('#grand-total-value')
    ).nativeElement;
    expect(grandTotalEl.textContent).toContain('1,500');
  });

  it('แสดงจำนวนที่ชำระ', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    const payEl = fixture.debugElement.query(
      By.css('#pay-value')
    ).nativeElement;
    expect(payEl.textContent).toContain('1,500');
  });

  it('แสดงเงินทอน', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    const changeEl = fixture.debugElement.query(
      By.css('#change-value')
    ).nativeElement;
    expect(changeEl.textContent).toContain(0);
  });

  it('แสดงปุ่มยืนยันชำระเงิน', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('#confirm-checkout-btn')
    ).nativeElement;
    expect(button.textContent).toContain('ยืนยันการชำระเงิน');
  });

  it('ทำรายการชำระเงินและปิด checkout modal เมื่อกดปุ่มยืนยันการชำระเงิน', () => {
    spyOn(component, 'onMakeTransaction');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('#confirm-checkout-btn')
    ).nativeElement;
    button.click();
    expect(component.onMakeTransaction).toHaveBeenCalled();
  });
});
