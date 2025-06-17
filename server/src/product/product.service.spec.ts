import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './product.service';
import { Product } from './entities/product.entity';

const mockProducts = [
  { _id: '1', name: 'คอมพิวเตอร์', price: 1000, stock: 30 },
  { _id: '2', name: 'พัดลม', price: 500, stock: 50 },
];

const mockProductModel = {
  find: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockProducts),
  insertMany: jest.fn(),
  updateOne: jest.fn(),
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
    it('เรียก model.find() และคืนค่า products ที่ name มี keyword ที่ใช้ค้นหาเป็นส่วนประกอบ', async () => {
      const keyword = 'คอม';
      const expectedQuery = {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      };

      mockProductModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });

      const result = await service.findAll(keyword);
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalledWith(expectedQuery);
    });

    it('เรียก model.find() และคืนค่า products ที่ description มี keyword ที่ใช้ค้นหาเป็นส่วนประกอบ', async () => {
      const keyword = 'ระบาย';
      const expectedQuery = {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      };

      mockProductModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });

      const result = await service.findAll(keyword);
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalledWith(expectedQuery);
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

  describe('findManyByIds', () => {
    it('เรียก find ด้วย id array', async () => {
      const ids = ['1', '2'];

      mockProductModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProducts),
      });

      const result = await service.findManyByIds(ids);

      expect(mockProductModel.find).toHaveBeenCalledWith({ _id: { $in: ids } });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('updateStock', () => {
    it('เรียก updateOne ด้วยค่า stock ที่ถูกต้อง', async () => {
      const productId = '1';
      const stock = 20;

      mockProductModel.updateOne.mockResolvedValueOnce({ modifiedCount: 1 });

      const result = await service.updateStock(productId, stock);

      expect(mockProductModel.updateOne).toHaveBeenCalledWith(
        { _id: productId },
        { $set: { stock } },
      );
      expect(result).toEqual({ modifiedCount: 1 });
    });
  });
});
