import { CartService } from './cart.service';
import { signal } from '@angular/core';
import { ICartItem } from '../model/cart.model';
import { IProduct } from '../../products/models/products.model';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
    service['_cart'] = signal<ICartItem[]>([]);
  });

  it('เพิ่ม product เข้าในตะกร้าสินค้า', () => {
    const product: IProduct = {
      _id: '1234567',
      name: 'ตอมพิวเตอร์',
      stock: 30,
      price: 1000,
    };

    service.addToCart(product);

    const cartItems = service['_cart']();

    expect(cartItems.length).toBe(1);
    expect(cartItems[0]._id).toBe('1234567');
    expect(cartItems[0].quantity).toBe(1);
  });

  it('ล้างตะกร้ากินค้า', () => {
    service['_cart'].set([
      {
        _id: '1234567',
        name: 'ตอมพิวเตอร์',
        stock: 30,
        price: 1000,
        quantity: 1,
      },
    ]);

    service.clearCart();

    const cartItems = service['_cart']();

    expect(cartItems.length).toBe(0);
  });

  it('คำนวณราคารวมได้ถูกต้องเมื่อเพิ่มสินค้า', () => {
    const product: IProduct = {
      _id: '73638893',
      name: 'จอ 4K',
      stock: 10,
      price: 5000,
    };

    service.addToCart(product);

    expect(service.totalPrice()).toBe(5000);
  });

  it('เพิ่มจำนวนสินค้าเดิมถ้ากดซ้ำ', () => {
    const product: ICartItem = {
      _id: '1234567',
      name: 'ตอมพิวเตอร์',
      stock: 30,
      price: 1000,
      quantity: 1,
    };

    service.addToCart(product);
    service.addToCart(product);

    const cartItems = service['_cart']();

    expect(cartItems.length).toBe(1);
    expect(cartItems[0].quantity).toBe(2);
  });

  it('คำนวณราคารวมได้ถูกต้องเมื่อมีสินค้าหลายชิ้น', () => {
    const product1: IProduct = {
      _id: '1',
      name: 'คีย์บอร์ด',
      stock: 10,
      price: 1000,
    };

    const product2: IProduct = {
      _id: '2',
      name: 'เมาส์',
      stock: 5,
      price: 500,
    };

    service.addToCart(product1);
    service.addToCart(product2);

    expect(service.totalPrice()).toBe(1500);
  });

  it('แสดง alert ถ้าจำนวนสินค้าเกิน stock', () => {
    const product: IProduct = {
      _id: '1234567',
      name: 'ตอมพิวเตอร์',
      stock: 1,
      price: 1000,
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
      stock: 0,
      price: 100,
    };

    const alertSpy = spyOn(window, 'alert');
    service.addToCart(product);

    expect(alertSpy).toHaveBeenCalledWith('สินค้าเกินจำนวนในสต็อก');
  });
});
