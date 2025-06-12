import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from 'src/schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('/:id')
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.findOneById(id);
  }
}
