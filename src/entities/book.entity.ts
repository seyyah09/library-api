import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";
import { Borrow } from "./borrow.entity";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: false, nullable: false })
    bookName: string;

    @Column({ unique: false, nullable: false })
    author: string;

    @Column({ unique: false, nullable: false })
    press: string;

    @ManyToMany(() => User, (user) => user.borrowedBooks)
    @JoinColumn()
    borrowers: User[];
  
    // Define one-to-many relationship with Borrow entity
    @OneToMany(() => Borrow, (borrow) => borrow.book)
    borrows: Borrow[];

    @Column({ nullable: true })
    review: number;
}