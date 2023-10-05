import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../src/entities/book.entity';
import { CreateBookDto } from '../../src/dto/create-book.dto';
import { IsNull, Not, Repository } from 'typeorm';
import { Borrow } from '../../src/entities/borrow.entity';
import { BorrowDto } from '../../src/dto/borrow.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ReturnDto } from 'src/dto/return.dto';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
        @InjectRepository(Borrow) private readonly borrowRepo: Repository<Borrow>,
        private readonly userService: UserService
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
                name: true,
                reviewScore: true,
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
        return await this.borrowRepo
        .createQueryBuilder('borrow')
        .leftJoinAndSelect('borrow.book', 'book')
        .leftJoinAndSelect('borrow.user', 'user')
        .where('borrow.id = :id', { id })
        .getOne();
    }

    async borrow(borrowDto: BorrowDto) {

        const user = new User;
        const book = new Book;
        user.id = borrowDto.userId;
        book.id = borrowDto.bookId;

        const borrowData = {user, book};

        const borrowedData = await this.borrowRepo.save(borrowData);

        const newBorrowId: number = borrowedData.id;
        return this.findBorrow(newBorrowId);
    }

    async isBookAvailable(bookId: number) {
        const book = await this.findBook(bookId);

        if (!book) {
          throw new NotFoundException('Book not found!')
        }
        
        // calismayan kod:
        // const borrowedBook: Borrow | undefined = await this.borrowRepo.findOne({
        //     where: {
        //         book: book,
        //         returnDate: null
        //     }
        // });

        const borrowedBook: (Borrow | undefined) = await this.borrowRepo
        .createQueryBuilder('borrow')
        .leftJoinAndSelect('borrow.book', 'book')
        .where('borrow.bookId = :bookId', { bookId })
        .andWhere('borrow.returnDate IS NULL')
        .getOne();

        return !!borrowedBook ? false : true;
    }

    async returnBook(returnDto: ReturnDto): Promise<Borrow> {
        const borrowRecord = await this.findBorrow(returnDto.borrowId);
    
        if (!borrowRecord) {
          throw new NotFoundException('No such borrow!');
        }

        if (borrowRecord.returnDate) {
            throw new NotFoundException('This book already returned!');
        }

        const userIdFromDB = await this.userService.findOne(returnDto.userId);

        if (borrowRecord.user.id != userIdFromDB.id) {
            throw new NotFoundException('User Id doesnt match!');
        }
    
        borrowRecord.returnDate = new Date();

        borrowRecord.review = returnDto.review;
    
        try {
          await this.borrowRepo.save(borrowRecord);
        } catch (error) {
          throw new Error('Failed to update borrow record');
        }

        const bookId:number = borrowRecord.book.id;

        const bookRecord = await this.findOneBook(bookId); 
          
        if(bookRecord.reviewScore === -1) {
            bookRecord.reviewScore = returnDto.review;
            await this.bookRepo.save(bookRecord);
        } else {
            bookRecord.reviewScore = await this.calculateAverageReviewScore(bookId);
            await this.bookRepo.save(bookRecord);            
        }
        return await this.findBorrow(returnDto.borrowId);
    }

    async calculateAverageReviewScore(bookId: number): Promise<number> {
        const result = await this.borrowRepo
          .createQueryBuilder('borrow')
          .where('borrow.bookId = :bookId', { bookId })
          .select('AVG(borrow.review)', 'averageReview')
          .getRawOne();
    
        return result.averageReview;
    }

    // async findBooksForUser(id: number){
    //     return  {
    //         message: `here are the books borrowed by the user with id: \'${id}\'`,
    //         result: await this.bookRepo.findBy(
    //             {userId: id}
    //         )
    //     }
    // }
}
