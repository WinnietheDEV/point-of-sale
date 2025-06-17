import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().select('name price stock').lean().exec();
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`ไมพบสินค้า ID: ${id}`);
    }
    return product;
  }

  async createMany(products: Product[]): Promise<Product[]> {
    return await this.productModel.insertMany(products);
  }

  async findManyByIds(ids: string[]) {
    return this.productModel.find({ _id: { $in: ids } }).exec();
  }

  async updateStock(productId: string, stock: number) {
    return this.productModel.updateOne({ _id: productId }, { $set: { stock } });
  }
}
