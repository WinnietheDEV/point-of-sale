import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { IProduct } from '../models/products.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProducts: IProduct[] = [
    { _id: '1', name: 'คอมพิวเตอร์', price: 20000, stock: 30 },
    { _id: '2', name: 'พัดลมระบายความร้อน', price: 500, stock: 50 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('ดึงข้อมูลสินค้าด้วยการเรียก API ด้วย method GET ไปที่ http://localhost:3001/products และอัพเดท loadedProducts เป็นข้อมูลสินค้าที่ดึงข้อมูลมา', () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(service.products()).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3001/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('โยน error เมื่อการเรียก API เกิด error และคืนค่าข้อความที่กำหนด', () => {
    const errorMsg = 'Something went wrong';

    service.getProducts().subscribe({
      next: () => fail('Expected error'),
      error: (error) => {
        expect(error.message).toBe(errorMsg);
        expect(service.products()).toEqual([]);
      },
    });

    const req = httpMock.expectOne('http://localhost:3001/products');
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });
});
