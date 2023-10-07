import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from './user.service';
import { BookService } from '../book/book.service';
import { BorrowDto } from 'src/dto/borrow.dto';
import { ReturnDto } from 'src/dto/return.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly bookService: BookService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    };

    @Get(':id')
    findUser(@Param("id") id:number) {
        return this.userService.getPastAndPresentForUser(id);
    };

    @Post('/:userid/borrow/:bookid')
    async borrow(@Param('userid') userId: number, @Param('bookid') bookId: number) {
        const userCheck = await this.userService.userIdCheck(userId);

        if (userCheck === false) {
            throw new HttpException ('User Id not found!', HttpStatus.NOT_FOUND);
        }

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

    
    @Post('/:userid/return/:bookid')
    async returnBook(@Param('userid') userId: number, @Param('bookid') bookId: number, @Body() req) {
        const userCheck = await this.userService.userIdCheck(userId);

        if (userCheck === false) {
            throw new HttpException ('User Id not found!', HttpStatus.NOT_FOUND);
        }

        const borrowCheck = await this.bookService.findBorrow(userId, bookId)

        if (!borrowCheck) {            
            throw new HttpException ('No such borrow!', HttpStatus.NOT_ACCEPTABLE);
        }

        const score:number = req.score;

        const returnDto: ReturnDto = { userId, bookId, score }

        return {
            message: `Thanks! Book returned successfully`,
            result: await this.bookService.returnBook(returnDto)
        }
    }

    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return  {
            message: "the user created as follows:",
            user: await this.userService.create(dto)
        }
    }
    
    // @Put(':id')
    // async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    //     return {
    //         message: `Wooww! user info updated for the user with id:${id} successfully`,
    //         result: await this.userService.update(id, updateUserDto)
    //     }
    // }
}
