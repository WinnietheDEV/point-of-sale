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

  // 1. Input grandTotal
  it('should accept grandTotal input = 1500', () => {
    component.grandTotal = 1500;
    expect(component.grandTotal).toBe(1500);
  });

  // 2. Pay = grandTotal
  it('should set pay equal to grandTotal', () => {
    component.grandTotal = 1500;
    component.pay = component.grandTotal;
    expect(component.pay).toBe(1500);
  });

  // 3. Change calculation
  it('should calculate change correctly when pay = 1500 and grandTotal = 1500', () => {
    component.grandTotal = 1500;
    component.pay = 1500;
    component.change.set(component.pay - component.grandTotal);
    expect(component.change()).toBe(0);
  });

  // 4. onMakeTransaction calls service and closes modal
  it('should call checkoutService.makeTransaction and close modal', () => {
    const closeModal = jasmine.createSpy();
    (component as any).closeModal = closeModal;

    component.grandTotal = 1500;
    component.pay = 1500;
    component.change.set(0);
    component.paymentMethod.set('เงินสด');

    component.onMakeTransaction();

    expect(mockCheckoutService.makeTransaction).toHaveBeenCalledWith({
      products: mockCartService.cartItems(),
      grandTotal: 1500,
      pay: 1500,
      change: 0,
      paymentMethod: 'เงินสด',
    });

    expect(closeModal).toHaveBeenCalled();
  });

  // 5. Template: grandTotal rendered
  it('should display formatted grandTotal in template', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    const grandTotalEl = fixture.debugElement.query(
      By.css('#grand-total-value')
    ).nativeElement;
    expect(grandTotalEl.textContent).toContain('1,500');
  });

  // 6. Template: pay rendered
  it('should display formatted pay in template', () => {
    component.grandTotal = 1500;
    fixture.detectChanges();
    const payEl = fixture.debugElement.query(
      By.css('#pay-value')
    ).nativeElement;
    expect(payEl.textContent).toContain('1,500');
  });

  // 7. Template: change rendered
  it('should display formatted change in template', () => {
    component.change.set(200);
    fixture.detectChanges();
    const changeEl = fixture.debugElement.query(
      By.css('#change-value')
    ).nativeElement;
    expect(changeEl.textContent).toContain('200');
  });

  // 8. Confirm button is present
  it('should render confirm checkout button', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('#confirm-checkout-btn')
    ).nativeElement;
    expect(button.textContent).toContain('ยืนยันการชำระเงิน');
  });

  // 9. Confirm button click calls onMakeTransaction
  it('should call onMakeTransaction when confirm button is clicked', () => {
    spyOn(component, 'onMakeTransaction');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('#confirm-checkout-btn')
    ).nativeElement;
    button.click();
    expect(component.onMakeTransaction).toHaveBeenCalled();
  });
});
