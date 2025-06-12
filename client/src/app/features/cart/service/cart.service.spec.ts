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

  beforeEach(() => {
    service = new CartService();
    service['_cart'] = signal<ICartItem[]>([]); // assuming you're using signal
  });

  it('เพิ่ม product เข้าในตะกร้าสินค้า', () => {
    const product: IProduct = {
      _id: '1234567',
      name: 'แทบเลต ขนาด 16.8 นิ้ว',
      description: 'แทบเลตจอ Amoled ขนาด 16.8 นิ้ว',
      stock: 50,
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
      name: 'แทบเลต ขนาด 16.8 นิ้ว',
      description: 'แทบเลตจอ Amoled ขนาด 16.8 นิ้ว',
      stock: 50,
      price: 140,
    };

    service.addToCart(product);
    service.addToCart(product);

    const cartItems = service['_cart']();

    expect(cartItems.length).toBe(1); // ยังมีแค่ 1 ชิ้น
    expect(cartItems[0].quantity).toBe(2); // แต่ quantity เป็น 2
  });

  it('แสดง alert ถ้าจำนวนสินค้าเกิน stock', () => {
    const product: IProduct = {
      _id: '1234567',
      name: 'แทบเลต ขนาด 16.8 นิ้ว',
      description: 'แทบเลตจอ Amoled ขนาด 16.8 นิ้ว',
      stock: 1,
      price: 140,
    };

    service.addToCart(product);
    const alertSpy = spyOn(window, 'alert');
    service.addToCart(product);

    expect(alertSpy).toHaveBeenCalledWith('สินค้าเกินจำนวนในสต็อก');
  });

  it('แสดง alert ถ้าพยายามเพิ่มสินค้าที่ stock = 0', () => {
    const product: IProduct = {
      _id: '9999999',
      name: 'หูฟัง USB',
      description: '',
      stock: 0,
      price: 100,
    };

    const alertSpy = spyOn(window, 'alert'); // 👈 spy before calling
    service.addToCart(product);

    expect(alertSpy).toHaveBeenCalledWith('สินค้าเกินจำนวนในสต็อก');
  });

  it('คำนวณ grandTotal ได้ถูกต้องเมื่อเพิ่มสินค้า', () => {
    const product: IProduct = {
      _id: '1',
      name: 'จอ 4K',
      description: 'จอคมชัดระดับ 4K',
      stock: 10,
      price: 5000,
    };

    service.addToCart(product); // quantity = 1

    expect(service.grandTotal()).toBe(5000);
  });

  it('คำนวณ grandTotal ได้ถูกต้องเมื่อมีสินค้าหลายชิ้น', () => {
    const product1: IProduct = {
      _id: '1',
      name: 'คีย์บอร์ด',
      description: '',
      stock: 10,
      price: 1000,
    };

    const product2: IProduct = {
      _id: '2',
      name: 'เมาส์',
      description: '',
      stock: 5,
      price: 500,
    };

    service.addToCart(product1);
    service.addToCart(product2);
    service.addToCart(product2);

    expect(service.grandTotal()).toBe(1000 + 2 * 500);
  });
});
