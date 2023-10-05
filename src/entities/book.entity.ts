import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Borrow } from "./borrow.entity";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: false, nullable: false })
    name: string;

    @Column({ type: 'numeric', precision: 3, scale: 2, default: -1 })
    reviewScore: number;

    @OneToMany(() => Borrow, (borrow: Borrow) => borrow.book)
    borrowers: Borrow[];
}