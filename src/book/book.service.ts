import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../src/entities/book.entity';
import { CreateBookDto, UpdateBookDto } from '../../src/dto/create-book.dto';
import { Repository } from 'typeorm';
import { Borrow } from 'src/entities/borrow.entity';
import { BorrowDto } from 'src/dto/borrow.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
        @InjectRepository(Borrow) private readonly borrowRepo: Repository<Borrow>
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
            }
        })
    }

    async findOneBook(id:number){
        const book = await this.bookRepo.findOne({
            where: {
                id: id
            }
        });
        return book;
    }

    async findBorrow(id:number){
        const borrow = await this.borrowRepo.findOne({
            where: {
                id: id
            }
        });
        return borrow;
    }

    async borrow(borrowDto: BorrowDto) {

        const borrow = this.borrowRepo.create(borrowDto);

        await this.borrowRepo.save(borrow);

        const newBorrowId: number = borrow.id;
        
        return await this.findBorrow(newBorrowId);
    }

    async isBorrowed(bookId: number) {
        return await this.borrowRepo.findOne({
            where: {
                bookId: bookId,
                returnDate: null
            }
        })
    }

    // async findBooksForUser(id: number){
    //     return  {
    //         message: `here are the books borrowed by the user with id: \'${id}\'`,
    //         result: await this.bookRepo.findBy(
    //             {userId: id}
    //         )
    //     }
    // }

    async update(id: number, updateBookDto: UpdateBookDto) {
        return await this.bookRepo.update(id, updateBookDto);
    }

    async delete(id: number) {
        return await this.bookRepo.delete(id);
    }
}
