import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { ProductsService } from 'src/product/product.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly productService: ProductsService,
  ) {}

  async createTransaction(transactionData: CreateTransactionDto) {
    const createdTransaction =
      await this.transactionModel.create(transactionData);

    const productIds = transactionData.products.map((p) => p._id);

    const productsFromDB = await this.productService.findManyByIds(productIds);

    for (const productFromDB of productsFromDB) {
      const productFromTransaction = transactionData.products.find(
        (p) => p._id.toString() === productFromDB._id.toString(),
      );

      if (productFromTransaction) {
        const newStock = productFromDB.stock - productFromTransaction.quantity;

        if (newStock < 0) {
          throw new Error(
            `Insufficient stock for product ${productFromDB._id.toString()}`,
          );
        }

        await this.productService.updateStock(
          productFromDB._id.toString(),
          newStock,
        );
      }
    }
    return createdTransaction;
  }
}
