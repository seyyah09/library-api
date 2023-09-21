import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

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

    @Column({ nullable: true })
    review: number;

    @Column({ nullable: true })
    userId: number; //geçici olarak yazildi
}