import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProducts: Product[] = [
    { name: 'คอมพิวเตอร์', price: 1000, stock: 30 },
    { name: 'พัดลม', price: 500, stock: 50 },
  ];

  const mockProduct: Product = { name: 'คอมพิวเตอร์', price: 1000, stock: 30 };

  const mockProductsService: Partial<Record<keyof ProductsService, jest.Mock>> =
    {
      findAll: jest.fn().mockResolvedValue(mockProducts),
      findOneById: jest.fn().mockResolvedValue(mockProduct),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('ควรคืนผลลัพธ์ทั้งหมดเมื่อไม่มี keyword (query param)', async () => {
      const result = await controller.getProducts(undefined); // keyword query param is undefined
      expect(result).toEqual(mockProducts);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('ควรคืนผลลัพธ์ที่ชื่อสินค้ามี keyword (query param)', async () => {
      const keyword = 'คอม';
      const result = await controller.getProducts(keyword); // simulate query ?keyword=คอม
      expect(mockProductsService.findAll).toHaveBeenCalledWith(keyword);
      expect(result).toEqual(mockProducts);
    });

    it('ควรคืนผลลัพธ์ที่คำอธิบายสินค้ามี keyword (query param)', async () => {
      const keyword = 'ระบาย';
      const result = await controller.getProducts(keyword); // simulate query ?keyword=ระบาย
      expect(mockProductsService.findAll).toHaveBeenCalledWith(keyword);
      expect(result).toEqual(mockProducts);
    });
  });
});
