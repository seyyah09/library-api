import { IsNotEmpty, IsNumber, Max, Min, } from "class-validator";

export class ReturnDto {
    
    @IsNumber()
    userId: number;

    @IsNumber()
    borrowId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(10)
    review: number;
}