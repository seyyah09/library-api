import { IsNotEmpty, IsNumber, Max, Min, } from "class-validator";

export class BorrowDto {
    
    @IsNumber()
    userId: number;

    @IsNumber()
    bookId: number;
}