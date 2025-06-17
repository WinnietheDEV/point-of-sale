import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getProducts(@Query('keyword') keyword?: string): Promise<Product[]> {
    return this.productService.findAll(keyword);
  }

  @Get('/:id')
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.findOneById(id);
  }
}
