import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ContactDto {
    @IsOptional()
    @IsString()
    @Length(1, 50)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
}