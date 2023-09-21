import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { UserService } from '../../src/user/user.service';
import { Repository } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book])],
  providers: [BookService, UserService, Repository],
  exports: [BookService],
  controllers: [BookController]
})
export class BookModule {}
