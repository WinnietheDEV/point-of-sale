import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CheckoutService } from './checkout.service';
import { ITransaction } from '../model/transaction.model';
import { TestBed } from '@angular/core/testing';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let httpMock: HttpTestingController;

  const mockTransaction: ITransaction = {
    products: [
      {
        _id: '372732',
        name: 'คอมพิวเตอร์',
        stock: 50,
        price: 20000,
        quantity: 1,
      },
    ],
    grandTotal: 20000,
    paymentMethod: 'cash',
    pay: 20000,
    change: 0,
  };

  const backendUrl = 'http://localhost:3001';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CheckoutService],
    });

    service = TestBed.inject(CheckoutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('ควรส่ง transaction ไปที่ API และได้ข้อมูลกลับคืน', () => {
    service.makeTransaction(mockTransaction).subscribe((response) => {
      expect(response).toEqual({ _id: '372732', ...mockTransaction });
    });

    const req = httpMock.expectOne(`${backendUrl}/transaction`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTransaction);

    req.flush({ _id: '372732', ...mockTransaction });
  });
});
