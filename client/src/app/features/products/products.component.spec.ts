import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from './services/products.service';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { IProduct } from './models/products.model';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  const mockProducts: IProduct[] = [
    { _id: '1', name: 'คอมพิวเตอร์', price: 20000, stock: 30 },
    { _id: '2', name: 'พัดลมระบายความร้อน', price: 500, stock: 50 },
  ];

  let mockProductsSignal = signal<IProduct[]>([]);

  const mockProductsService = {
    getProducts: () => {
      mockProductsSignal.set(mockProducts);
      return of(mockProducts);
    },
    products: mockProductsSignal.asReadonly(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideHttpClient(),
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('สร้าง products component', () => {
    expect(component).toBeTruthy();
  });

  it('อัพเดทค่า products หลังดึงข้อมูลสินค้า ', () => {
    expect(component.isFetching()).toBeFalse();
    expect(component.productsList()).toEqual(mockProducts);
  });

  it('แสดงรายการสินค้าตามข้อมูลสินค้าที่มี พร้อมข้อมูลที่เกี่ยวข้องของสินค้าแต่ละตัว', () => {
    const productCards = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productCards.length).toBe(2);

    const firstCardText = productCards[0].nativeElement.textContent;
    const secondCardText = productCards[1].nativeElement.textContent;

    expect(firstCardText).toContain('คอมพิวเตอร์');
    expect(firstCardText).toContain('฿20,000');
    expect(firstCardText).toContain('จำนวนสินค้าในคลัง: 30');

    expect(secondCardText).toContain('พัดลมระบายความร้อน');
    expect(secondCardText).toContain('฿500.00');
    expect(secondCardText).toContain('จำนวนสินค้าในคลัง: 50');
  });

  it('แสดงข้อความ "ไม่มีสินค้า" เมื่อไม่มีข้อมูลสินค้า', () => {
    mockProductsSignal.set([]);

    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productCards.length).toBe(0);

    const emptyText = fixture.debugElement.nativeElement.textContent;
    expect(emptyText).toContain('ไม่มีสินค้า');
  });

  describe('Products component alternative cases', () => {
    beforeEach(async () => {
      const errorService = {
        getProducts: () => throwError(() => new Error('Fetch failed')),
        products: signal<IProduct[]>([]).asReadonly(),
      };

      await TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [ProductsComponent],
          providers: [
            provideHttpClient(),
            { provide: ProductsService, useValue: errorService },
          ],
        })
        .compileComponents();

      fixture = TestBed.createComponent(ProductsComponent);
      component = fixture.componentInstance;
    });

    it('อัพเดทค่า error และ isFetchign หลังดึงข้อมูลสินค้าแล้วเกิด error', () => {
      fixture.detectChanges();

      expect(component.isError()).toBe('Fetch failed');
      expect(component.isFetching()).toBeFalse();
    });
  });
});
