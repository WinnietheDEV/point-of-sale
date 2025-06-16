import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

const mockTransaction: Transaction = {
  products: [{ _id: '372732', name: 'คอมพิวเตอร์', price: 20000, quantity: 1 }],
  grandTotal: 20000,
  paymentMethod: 'cash',
  pay: 20000,
  change: 0,
};

const mockTransactionModel = {
  create: jest.fn(),
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
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);

    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('เรียก model.create และคืนค่าข้อมูล transaction', async () => {
      const dto: CreateTransactionDto = {
        products: [
          { _id: '372732', name: 'คอมพิวเตอร์', price: 20000, quantity: 1 },
        ],
        grandTotal: 20000,
        paymentMethod: 'cash',
        pay: 20000,
        change: 0,
      };

      mockTransactionModel.create.mockResolvedValueOnce(mockTransaction);

      const result = await service.createTransaction(dto);

      expect(mockTransactionModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTransaction);
      expect(result.products.length).toBe(1);
    });
  });
});
