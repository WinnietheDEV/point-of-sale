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
  let getProductsSpy: jasmine.Spy;

  const mockProducts: IProduct[] = [
    { _id: '1', name: 'คอมพิวเตอร์', price: 20000, stock: 30 },
    { _id: '2', name: 'พัดลมระบายความร้อน', price: 500, stock: 50 },
  ];

  let mockProductsSignal = signal<IProduct[]>([]);

  beforeEach(async () => {
    mockProductsSignal.set([]);

    getProductsSpy = jasmine.createSpy('getProducts').and.callFake(() => {
      mockProductsSignal.set(mockProducts);
      return of(mockProducts);
    });

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ProductsService,
          useValue: {
            getProducts: getProductsSpy,
            products: mockProductsSignal.asReadonly(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('สร้าง component ได้', () => {
    expect(component).toBeTruthy();
  });

  it('เรียก getProducts() เมื่อ component ถูกสร้าง', () => {
    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('อัพเดทค่า products หลัง getProducts สำเร็จ', () => {
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

  it('แสดงข้อความ "ไม่มีสินค้า" เมื่อไม่มีรายการสินค้า', () => {
    mockProductsSignal.set([]);
    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productCards.length).toBe(0);

    const emptyText = fixture.debugElement.nativeElement.textContent;
    expect(emptyText).toContain('ไม่มีสินค้า');
  });

  describe('เมื่อเกิด error จาก service', () => {
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
      fixture.detectChanges();
    });

    it('อัพเดท isError และ isFetching เป็น false เมื่อเกิด error', () => {
      expect(component.isError()).toBe('Fetch failed');
      expect(component.isFetching()).toBeFalse();
    });
  });
});
