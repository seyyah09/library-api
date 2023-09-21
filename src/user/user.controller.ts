import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/dto/create-user.dto';
import { UserService } from './user.service';
import { BookService } from 'src/book/book.service';
//import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly bookService: BookService) {}

    @Get('getallusers')
    getUsers() {
        return this.userService.getUsers();
    };

    @Get(':id')
    findOne(@Param("id") id:number) {
        return this.userService.findOne(id);
    };

    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return  {
            message: "thanks for joining us! the user created as follows:",
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
