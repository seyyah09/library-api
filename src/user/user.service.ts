import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Borrow } from 'src/entities/borrow.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Borrow) private readonly borrowRepo: Repository<Borrow>
    ) {}

    async getUsers(){
        return await this.userRepo.find({
            select: {
                id: true,
                name: true
            }
        })
    }

    async userIdCheck(id: number): Promise<boolean> {
        const user = await this.userRepo.findOne({
            where: {
                id: id
            }
        });
        return  user === null ? false : true;
    }

    async findOne(id:number): Promise<User> {
        const user = await this.userRepo.findOne({
            where: {
                id: id
            }
        });
        return user;
    }

    async getPastAndPresentForUser(userId: number): Promise<{ userId: number, userName: string, books: {past: { bookName: string, userScore: number }[], present: { bookName: string }[]} }> {
        const user = await this.findOne(userId);
        if (!user) {
          return null;
        }
    
        const pastBooks: Borrow[] = await this.borrowRepo
          .createQueryBuilder('borrow')
          .leftJoinAndSelect('borrow.book', 'book')
          .where('borrow.user = :userId', { userId })
          .andWhere('borrow.returnDate IS NOT NULL')
          .getMany();

          const presentBooks: Borrow[] = await this.borrowRepo
          .createQueryBuilder('borrow')
          .leftJoinAndSelect('borrow.book', 'book')
          .where('borrow.user = :userId', { userId })
          .andWhere('borrow.returnDate IS NULL')
          .getMany();

        const result: { userId: number, userName: string, books: {past: { bookName: string, userScore: number }[], present: { bookName: string }[]} } = {
          userId: user.id,
          userName: user.name,
          books: {
          past: pastBooks.map(borrow => ({
            bookName: borrow.book.name,
            userScore: borrow.userScore,
          })),
          present: presentBooks.map(borrow => ({
            bookName: borrow.book.name
          }))},
        }
        return result;
    };

    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepo.create(createUserDto);
        await this.userRepo.save(user);
        return user;
    }
}
