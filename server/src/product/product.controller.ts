import { Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from 'src/schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post('/entry')
  createEntryProduct(): Promise<Product> {
    return this.productService.createEntry();
  }
}
