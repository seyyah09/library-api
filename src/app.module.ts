import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { BookController } from './book/book.controller';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { BookService } from './book/book.service';
import { Repository } from 'typeorm';

@Module({
  imports: [BookModule, UserModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService, Repository],
})
export class AppModule {}
