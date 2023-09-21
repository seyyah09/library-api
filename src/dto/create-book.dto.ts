import { PartialType } from "@nestjs/mapped-types";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    
    @IsString()
    @IsNotEmpty()
    bookName: string;

    @IsString()
    author: string;

    @IsString()
    press: string;
}


export class UpdateBookDto extends PartialType(CreateBookDto){}