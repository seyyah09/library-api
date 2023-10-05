import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { UserService } from 'src/user/user.service';
import { BorrowDto } from 'src/dto/borrow.dto';
import { ReturnDto } from 'src/dto/return.dto';

@Controller('book')
export class BookController {
        constructor(
        private readonly bookService: BookService,
        private readonly userService: UserService
    ) {}

    //@UseGuards(JwtGuard)
    @Post()
    createBook(@Request() req, @Body() dto) {
        return this.bookService.create(dto);
    };
    
    @Get('getall')
    getBooks() {
        return this.bookService.getBooks();
    };

    @Get(':id')
    findOneBook(@Param("id") id:number) {
        return this.bookService.findOneBook(id);
    };

    @Post('borrow/:id')
    async borrow(@Param('id') userId: number, @Body() reqBody) {
        const userCheck = await this.userService.userIdCheck(userId);

        if (userCheck === false) {
            throw new HttpException ('User Id not found!', HttpStatus.NOT_FOUND);
        }

        const bookId:number = reqBody.book_id;

        const bookCheck = await this.bookService.findOneBook(bookId);

        if (!bookCheck) {
            throw new HttpException ('Book not found!', HttpStatus.NOT_FOUND);
        }

        const isAvailable = await this.bookService.isBookAvailable(bookId);
        
        if (!isAvailable) {            
            throw new HttpException ('This book is already borrowed!', HttpStatus.NOT_ACCEPTABLE);
        }

        const dto: BorrowDto =  { userId, bookId };

        return {
            message: `book borrowed successfully`,
            result: await this.bookService.borrow(dto)
        }
    }

    @Put('return')
    async returnBook(@Body() returnDto: ReturnDto) {
        const userCheck = await this.userService.userIdCheck(returnDto.userId);

        if (userCheck === false) {
            throw new HttpException ('User Id not found!', HttpStatus.NOT_FOUND);
        }

        const borrowCheck = await this.bookService.findBorrow(returnDto.borrowId)

        if (!borrowCheck) {            
            throw new HttpException ('No such borrow!', HttpStatus.NOT_ACCEPTABLE);
        }

        return {
            message: `Thanks! Book returned successfully`,
            result: await this.bookService.returnBook(returnDto)
        }
    }
}
