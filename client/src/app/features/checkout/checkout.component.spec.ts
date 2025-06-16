import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { computed, signal } from '@angular/core';
import { ICartItem } from '../cart/model/cart.model';
import { CartService } from '../cart/service/cart.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

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
    totalPrice: computed(() =>
      mockCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
    ),
  };

  beforeEach(async () => {
    mockCart.set([
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

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, HttpClientTestingModule],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('สร้าง checkout component', () => {
    expect(component).toBeTruthy();
  });

  describe('ค่าจาก cartService', () => {
    it('ใช้ค่า totalPrice จาก cartService', () => {
      const expectedTotal = mockCartService.totalPrice();
      expect(component.totalPrice()).toBe(expectedTotal);
      expect(component.totalPrice).toBe(mockCartService.totalPrice);
    });

    it('คำนวณ grandTotal ได้ถูกต้องจาก totalPrice และ discount', () => {
      component.discount.set('0');
      fixture.detectChanges();

      const expectedTotal = mockCartService.totalPrice();
      const expectedGrandTotal = expectedTotal - 0;

      expect(component.grandTotal()).toBe(expectedGrandTotal);
    });

    it('ปุ่มชำระเงินถูก disabled ถ้าตะกร้าว่าง', () => {
      mockCart.set([]);
      fixture.detectChanges();

      expect(component.isDisabledCheckoutButton()).toBeTrue();

      const button = fixture.nativeElement.querySelector('#checkout-btn');
      expect(button.disabled).toBeTrue();
    });
  });

  describe('การแสดงผล UI', () => {
    it('แสดงปุ่ม "ชำระเงิน"', () => {
      const buttonElement = fixture.nativeElement.querySelector('button');
      expect(buttonElement.textContent).toContain('ชำระเงิน');
    });

    it('แสดงราคารวมถูกต้อง', () => {
      const labelElement =
        fixture.nativeElement.querySelector('#total-price-label');
      const valueElement =
        fixture.nativeElement.querySelector('#total-price-value')?.textContent;

      expect(labelElement.textContent).toContain('ราคารวม');
      expect(valueElement).toContain('1,500');
    });

    it('แสดงส่วนลดถูกต้อง', () => {
      component.discount.set('1,000.00');
      fixture.detectChanges();

      const labelElement =
        fixture.nativeElement.querySelector('#discount-label');
      const inputElement: HTMLInputElement =
        fixture.nativeElement.querySelector('#discount-value');

      expect(labelElement.textContent).toContain('ส่วนลด');
      expect(inputElement.value).toContain('1,000');
    });

    it('แสดงราคาสุทธิถูกต้องหลังจากหักส่วนลด', () => {
      component.discount.set('1,000.00');
      fixture.detectChanges();

      const grandTotalText =
        fixture.nativeElement.querySelector('#grand-total-value')?.textContent;

      expect(grandTotalText).toContain('500.00');
    });
  });

  describe('การเปิด/ปิด modal', () => {
    it('ปิด checkoutModal ในตอนแรก', () => {
      expect(component.isCheckoutModalOpen()).toBeFalsy();
    });

    it('เปิด checkoutModal เมื่อสั่ง onOpenCheckoutModal', () => {
      component.onOpenCheckoutModal();
      expect(component.isCheckoutModalOpen()).toBeTruthy();
    });

    it('เปิด checkoutModal เมื่อคลิกปุ่มชำระเงิน', () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector('#checkout-btn');

      button.click();
      fixture.detectChanges();

      expect(component.isCheckoutModalOpen()).toBeTrue();
    });
  });
});
