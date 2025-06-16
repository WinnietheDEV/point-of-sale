import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    ProductsModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
