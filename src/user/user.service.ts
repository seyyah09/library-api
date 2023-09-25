import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {}

    async getUsers(){
        return await this.userRepo.find({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
            }
        })
    }

    async userIdCheck(id: number): Promise<boolean> {
        const user = await this.userRepo.findOne({
            where: {
                id: id
            }
        });
        console.log(user);
        return  user === null ? false : true;
    }

    async findOne(id:number): Promise<User | undefined> {
        const user = await this.userRepo.findOne({
            where: {
                id: id
            }
        });
        delete user.password;
        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepo.create(createUserDto);
        await this.userRepo.save(user);
        delete user.password;
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepo.update(id, updateUserDto);
    }
}
