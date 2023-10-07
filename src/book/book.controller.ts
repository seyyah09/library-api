import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { UserService } from 'src/user/user.service';
import { BorrowDto } from 'src/dto/borrow.dto';
import { ReturnDto } from 'src/dto/return.dto';

@Controller('books')
export class BookController {
        constructor(
        private readonly bookService: BookService,
        private readonly userService: UserService
    ) {}

    //@UseGuards(JwtGuard)
    @Post()
    async createBook(@Body() dto) {
        return {
            message: "the book created successfully:",
            result: await this.bookService.create(dto)
        }
    };
    
    @Get()
    getBooks() {
        return this.bookService.getBooks();
    };

    @Get(':id')
    findOneBook(@Param("id") id:number) {
        return this.bookService.findOneBook(id);
    };
}
