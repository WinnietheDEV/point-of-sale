import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ProductsService } from 'src/product/product.service';
import { AppModule } from 'src/app.module';
import { productsData } from './data/productsData';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productsService = app.get(ProductsService);

  try {
    await productsService.createMany(productsData);
    Logger.log('🌱 Seed complete!');
  } catch (err) {
    Logger.error('❌ Seed failed', err);
  } finally {
    await app.close();
  }
}

bootstrap();
