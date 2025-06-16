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
      _id: '1',
      name: 'ลำโพงบลูทูธ',
      stock: 120,
      price: 999,
      quantity: 1,
    },
    {
      _id: '2',
      name: 'เม้าส์',
      stock: 120,
      price: 100,
      quantity: 30,
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

  it('ใช้ค่า cartItems', () => {
    expect(component.itemsInCart()).toBe(mockCartService.cartItems());
  });

  it('แสดงรายการสินค้าในตะกร้าประกอบด้วยข้อมูล ชื่อสินค้า จำนวนในตะกร้า และราคา', () => {
    const cartHeader = fixture.debugElement.queryAll(By.css('.cart-header'));
    expect(cartHeader.length).toBe(1);
    const headerCardText = cartHeader[0].nativeElement.textContent;
    expect(headerCardText).toContain('รายการ');
    expect(headerCardText).toContain('จำนวน');
    expect(headerCardText).toContain('ราคา');
    const cartItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(cartItems.length).toBe(2);
    const firstCardText = cartItems[0].nativeElement.textContent;
    expect(firstCardText).toContain('ลำโพงบลูทูธ');
    expect(firstCardText).toContain('1');
    expect(firstCardText).toContain('฿999.00');

    const secondCardText = cartItems[1].nativeElement.textContent;
    expect(secondCardText).toContain('เม้าส์');
    expect(secondCardText).toContain('3');
    expect(secondCardText).toContain('฿3,000.00');
  });
});
