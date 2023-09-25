import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { UpdateBookDto } from 'src/dto/create-book.dto';
import { UserService } from 'src/user/user.service';
import { BorrowDto } from 'src/dto/borrow.dto';

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

    //@UseGuards(JwtGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
        return {
            message: `book updated as follows successfully`,
            result: await this.bookService.update(id, updateBookDto)
        }
    }

    @Post('borrow/:id')
    async borrow(@Param('id') userId: number, @Body() reqBody) {
        const userCheck = await this.userService.userIdCheck(userId);

        if (userCheck === false) {
            throw new HttpException ('User Id not found!', HttpStatus.NOT_FOUND);
        }

        const bookId:number = reqBody.book_id;

        const isBorrowed = await this.bookService.isBorrowed(bookId)
        
        if (isBorrowed) {            
            throw new HttpException ('This book is already borrowed!', HttpStatus.NOT_ACCEPTABLE);
        }

        const dto: BorrowDto =  { userId, bookId };

        return {
            message: `book borrowed successfully`,
            result: await this.bookService.borrow(dto)
        }
    }

    //@UseGuards(JwtGuard)
    // @Get('userbooks')
    // getBooksForUser(@Request() req) {
    //     const user_id: number = req.user.userId;
    //     return this.bookService.findBooksForUser(user_id);
    // };

    // //@UseGuards(JwtGuard)
    // @Delete(':id')
    // async delete(@Request() req, @Param('id') id: number) {
    //     const tokenId: number = req.user.user.userId;
    //     const userIdOfSelectedTask = (await this.bookService.findTask(id)).userId;

    //     const title = (await this.bookService.findTask(id)).title;
    //     return {
    //         result: await this.bookService.delete(id),
    //         message: `the book '${title}' deleted!`

    //     }
    // }
}
