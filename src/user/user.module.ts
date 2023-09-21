import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { BookModule } from '../book/book.module';
import { BookService } from 'src/book/book.service';
import { Book } from 'src/entities/book.entity';

@Module({
  imports: [BookModule, TypeOrmModule.forFeature([User, Book])], 
  controllers: [UserController],
  providers: [UserService, BookService]
})

export class UserModule {}