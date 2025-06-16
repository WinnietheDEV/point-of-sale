import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionController } from 'src/transaction/transaction.controller';
import { TransactionService } from 'src/transaction/transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransaction: Transaction = {
    products: [
      { _id: '372732', name: 'คอมพิวเตอร์', price: 20000, quantity: 1 },
    ],
    grandTotal: 20000,
    paymentMethod: 'cash',
    pay: 20000,
    change: 0,
  };

  const mockTransactionService: Partial<
    Record<keyof TransactionService, jest.Mock>
  > = {
    createTransaction: jest.fn().mockResolvedValue(mockTransaction),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    jest.clearAllMocks();
  });

  describe('postTransaction', () => {
    it('เรียก createTransaction service และคืนค่า transaction', async () => {
      const dto: CreateTransactionDto = {
        products: [
          { _id: '372732', name: 'คอมพิวเตอร์', price: 20000, quantity: 1 },
        ],
        grandTotal: 20000,
        paymentMethod: 'cash',
        pay: 20000,
        change: 0,
      };

      const result = await controller.postTransaction(dto);

      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        dto,
      );
      expect(result.grandTotal).toBe(20000);
      expect(result.products.length).toBe(1);
    });
  });
});
