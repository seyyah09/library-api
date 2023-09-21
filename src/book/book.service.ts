import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../src/entities/book.entity';
import { CreateBookDto, UpdateBookDto } from '../../src/dto/create-book.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepo: Repository<Book>
    ) {}

    async findBook(id: number) {
        return await this.bookRepo.findOne({
            where: {
                id: id
            }
        });
    }
    
    async create(createBookDto: CreateBookDto) {
        const book = await this.bookRepo.create(createBookDto);

        await this.bookRepo.save(book);

        const newBookId: number = book.id;
        
        return await this.findBook(newBookId);
    }

    async getBooks(){
        return await this.bookRepo.find({
            select: {
                id: true,
                bookName: true,
                author: true,
                press: true,
                review: true,
                userId: true
            }
        })
    }

    async findOne(id:number){
        const book = await this.bookRepo.findOne({
            where: {
                id: id
            }
        });
        return book;
    }

    async findBooksForUser(id: number){
        return  {
            message: `here are the books borrowed by the user with id: \'${id}\'`,
            result: await this.bookRepo.findBy(
                {userId: id}
            )
        }
    }

    async update(id: number, updateBookDto: UpdateBookDto) {
        return await this.bookRepo.update(id, updateBookDto);
    }

    async delete(id: number) {
        return await this.bookRepo.delete(id);
    }
}
