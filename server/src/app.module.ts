import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:yourStrongPasswordHere@localhost:27017/golfhistory?authSource=admin',
    ),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
