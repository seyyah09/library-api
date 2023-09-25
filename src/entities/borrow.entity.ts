import { Column, CreateDateColumn, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, UpdateDateColumn } from "typeorm";
import { Book } from "./book.entity";
import { User } from "./user.entity";

// for currently borrowed books!!!
@Entity()
export class Borrow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: false, nullable: false })
    bookId: number;

    @Column({ unique: false, nullable: false })
    userId: number;

    @ManyToOne(() => User, (user) => user.borrows)
    user: User;
  
    @ManyToOne(() => Book, (book) => book.borrowers)
    book: Book;

    @CreateDateColumn()
    borrowDate: Date;

    @Column({ nullable: true })
    returnDate: Date;
}
  