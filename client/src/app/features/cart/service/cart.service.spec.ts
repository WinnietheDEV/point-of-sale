import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { signal } from '@angular/core';
import { ICartItem } from '../model/cart.model';
import { IProduct } from '../../products/models/products.model';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    service = new CartService();
    service['_cart'] = signal<ICartItem[]>([]); // assuming you're using signal
  });

  it('เพิ่ม product เข้าในตะกร้าสินค้า', () => {
    const product: IProduct = {
      _id: '1234567',
      name: 'เนื้อสันใน',
      description: 'เนื้อสันในอย่างดี จากหมูที่ถูกเลี้ยงโดยหญ้าคุณภาพ',
      stock: 50,
      ordered: 100,
      price: 140,
    };

    service.addToCart(product);

    const cartItems = service['_cart']();

    expect(cartItems.length).toBe(1);
    expect(cartItems[0].product._id).toBe('1234567');
    expect(cartItems[0].quantity).toBe(1);
  });

  it('เพิ่มจำนวนสินค้าเดิมถ้ากดซ้ำ', () => {
    const product: IProduct = {
      _id: '1234567',
      name: 'เนื้อสันใน',
      description: '',
      stock: 50,
      ordered: 100,
      price: 140,
    };

    service.addToCart(product);
    service.addToCart(product);

    const cartItems = service['_cart']();

    expect(cartItems.length).toBe(1); // ยังมีแค่ 1 ชิ้น
    expect(cartItems[0].quantity).toBe(2); // แต่ quantity เป็น 2
  });
});
