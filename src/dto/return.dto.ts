import { IsNotEmpty, IsNumber, Max, Min, } from "class-validator";

export class ReturnDto {
    
    @IsNumber()
    userId: number;

    @IsNumber()
    bookId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(10)
    score: number;
}