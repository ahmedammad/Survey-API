import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class ContactDto {
    @ApiPropertyOptional({ description: 'Name of the contact person' })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    name?: string;

    @ApiPropertyOptional({ description: 'Email address of the contact person' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'Phone number in international (E.164) format (e.g. +49123456789)' })
    @IsOptional()
    @Matches(/^\+?[1-9]\d{6,14}$/, {
        message: 'Phone number must be a valid international format',
    })
    phone?: string;
}