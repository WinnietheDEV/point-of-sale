import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product } from 'src/schemas/product.schema';

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
    it('เรียก service.findAll และคืนค่า products ทั้งหมด', async () => {
      const result = await controller.getProducts();
      expect(result).toEqual(mockProducts);
      expect(mockProductsService.findAll).toHaveBeenCalled();
    });
  });
});
