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
    { _id: '1', name: 'iPhone', stock: 120, price: 999, ordered: 0 },
    { _id: '2', name: 'MacBook', stock: 3, price: 1999, ordered: 15 },
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

    expect(firstCardText).toContain('iPhone');
    expect(firstCardText).toContain('฿999.00');
    expect(firstCardText).toContain('Total items ordered: 0');

    expect(secondCardText).toContain('MacBook');
    expect(secondCardText).toContain('฿1,999.00');
    expect(secondCardText).toContain('Total items ordered: 15');
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

      expect(component.error()).toBe('Fetch failed');
      expect(component.isFetching()).toBeFalse();
    });
  });
});
