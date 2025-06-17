import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { ClientSession, Connection } from 'mongoose';
import { ProductsService } from 'src/product/product.service';

const mockTransactionData: Transaction = {
  products: [{ _id: '372732', name: 'คอมพิวเตอร์', price: 20000, quantity: 1 }],
  grandTotal: 20000,
  paymentMethod: 'cash',
  pay: 20000,
  change: 0,
};

const mockTransactionModel = {
  create: jest.fn(),
};

const mockProductService = {
  findManyByIds: jest.fn(),
  updateStock: jest.fn(),
};

const mockSession: Partial<ClientSession> = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

const mockConnection = {
  startSession: jest.fn().mockResolvedValue(mockSession),
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getModelToken('Transaction'),
          useValue: mockTransactionModel,
        },
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);

    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('สร้าง transaction และอัปเดต stock', async () => {
      const dto: CreateTransactionDto = {
        products: [
          { _id: '372732', name: 'คอมพิวเตอร์', price: 20000, quantity: 1 },
        ],
        grandTotal: 20000,
        paymentMethod: 'cash',
        pay: 20000,
        change: 0,
      };

      const mockProductsFromDb = [{ _id: '372732', stock: 10 }];

      mockTransactionModel.create.mockResolvedValueOnce(mockTransactionData);
      mockProductService.findManyByIds.mockResolvedValueOnce(
        mockProductsFromDb,
      );
      mockProductService.updateStock.mockResolvedValueOnce({
        modifiedCount: 1,
      });

      const result = await service.createTransaction(dto);

      expect(mockTransactionModel.create).toHaveBeenCalledWith(dto);
      expect(mockProductService.findManyByIds).toHaveBeenCalledWith(['372732']);
      expect(mockProductService.updateStock).toHaveBeenCalledWith('372732', 9);
      expect(result).toEqual(mockTransactionData);
    });
  });
});
