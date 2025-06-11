import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { IProduct } from '../models/products.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProducts: IProduct[] = [
    { _id: '1', name: 'iPhone', stock: 120, price: 999, ordered: 0 },
    { _id: '2', name: 'MacBook', stock: 3, price: 1999, ordered: 15 },
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
    httpMock.verify(); // Make sure no unmatched requests remain
  });

  it('ดึงข้อมูลสินค้าด้วยการเรียก API ด้วย method GET ไปที่ http://localhost:3001/products และอัพเดท loadedProducts เป็นข้อมูลสินค้าที่ดึงข้อมูลมา', () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(service.loadedProducts()).toEqual(mockProducts); // signal updated
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
        expect(service.loadedProducts()).toEqual([]);
      },
    });

    const req = httpMock.expectOne('http://localhost:3001/products');
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });
});
