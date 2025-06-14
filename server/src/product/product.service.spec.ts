import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './product.service';
import { Product } from 'src/schemas/product.schema';

const mockProducts = [
  { name: 'คอมพิวเตอร์', price: 1000, stock: 30 },
  { name: 'พัดลม', price: 500, stock: 50 },
];
const mockProductModel = {
  find: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockProducts),
  insertMany: jest.fn(),
};
describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('เรียก model.find และคืนค่า products ทั้งหมด', async () => {
      mockProductModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalled();
    });
  });

  describe('createMany', () => {
    it('สร้างและคืนค่า products ทั้งหมด', async () => {
      const newProducts = [
        { name: 'เมาส์', price: 200, stock: 100 },
        { name: 'คีย์บอร์ด', price: 300, stock: 50 },
      ];

      mockProductModel.insertMany.mockResolvedValue(newProducts);

      const result = await service.createMany(newProducts);
      expect(result).toEqual(newProducts);
      expect(mockProductModel.insertMany).toHaveBeenCalledWith(newProducts);
    });
  });
});
