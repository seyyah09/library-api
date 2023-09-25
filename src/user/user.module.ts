import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { BookModule } from '../book/book.module';
import { BookService } from 'src/book/book.service';
import { Book } from 'src/entities/book.entity';
import { Borrow } from 'src/entities/borrow.entity';

@Module({
  imports: [BookModule, TypeOrmModule.forFeature([User, Book, Borrow])], 
  controllers: [UserController],
  providers: [UserService, BookService]
})

export class UserModule {}