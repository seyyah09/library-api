import { BeforeInsert, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Book } from "./book.entity";
import { Borrow } from "./borrow.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    firstname: string;

    @Column({ nullable: false })
    lastname: string;

    @Column({ unique: true, nullable: false })
    email: string;

      // Define many-to-many relationship with Book entity through the Borrow entity
    @ManyToMany(() => Book, (book) => book.borrowers)
    borrowedBooks: Book[];

    // Define one-to-many relationship with Borrow entity
    @OneToMany(() => Borrow, (borrow) => borrow.user)
    borrows: Borrow[];

    @Column({ nullable: false })
    password: string;
    
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }
}