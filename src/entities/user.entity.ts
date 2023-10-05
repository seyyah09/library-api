import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Borrow } from "./borrow.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  // Define one-to-many relationship with the Borrow entity
  @OneToMany(() => Borrow, (borrow: Borrow) => borrow.user)
  borrowedBooks: Borrow[];
}