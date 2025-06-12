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
    return this.productModel.find().select('name price ordered stock').exec();
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`ไมพบสินค้า ID: ${id}`);
    }
    return product;
  }

  async createEntry(): Promise<Product> {
    return new this.productModel({
      name: 'VS assasin 47',
      description:
        'A professional badminton racket tailored to those who serious about badminton',
      stock: 72,
      price: 2200,
      ordered: 0,
    }).save();
  }

  async create(product: Product): Promise<Product> {
    return new this.productModel(product).save();
  }

  async createMany(products: Product[]): Promise<Product[]> {
    return await this.productModel.insertMany(products);
  }
}
