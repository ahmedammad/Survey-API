import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class ContactDto {
    @IsOptional()
    @IsString()
    @Length(1, 50)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Matches(/^\+?[1-9]\d{6,14}$/, {
        message: 'Phone number must be a valid international format',
    })
    phone?: string;
}