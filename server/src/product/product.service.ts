import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().select('name price stock').exec();
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`ไมพบสินค้า ID: ${id}`);
    }
    return product;
  }

  async create(product: Product): Promise<Product> {
    return new this.productModel(product).save();
  }

  async createMany(products: Product[]): Promise<Product[]> {
    return await this.productModel.insertMany(products);
  }
}
