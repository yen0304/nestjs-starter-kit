import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './core/config/app.config';
import databaseConfig from './core/database/config/database.config';
import { DatabaseModule } from './core/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { TagsModule } from './modules/tags/tags.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    DatabaseModule,
    UsersModule,
    CategoriesModule,
    TagsModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
