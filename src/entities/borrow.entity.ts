import { Column, CreateDateColumn, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, UpdateDateColumn } from "typeorm";
import { Book } from "./book.entity";
import { User } from "./user.entity";

// for currently borrowed books!!!
@Entity()
export class Borrow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.borrowedBooks)
    user: User;
  
    @ManyToOne(() => Book, (book) => book.borrowers)
    book: Book;

    @CreateDateColumn({type: 'timestamp'})
    borrowDate: Date;

    @Column({ type: 'date', nullable: true})
    returnDate: Date;

    @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true })
    review: number | null;
}

  