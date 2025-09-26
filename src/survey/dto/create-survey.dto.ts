import { IsArray, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ContactDto } from './contact.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PropertyType {
    SINGLE = 'Einfamilienhaus',
    MULTI = 'Mehrfamilienhaus',
    COMMERCIAL = 'Gewerbeimmobilie',
}

export enum RoofOrientation {
    SOUTH = 'Süd',
    WEST = 'West',
    EAST = 'Ost',
    NORTH = 'Nord',
    NONE = 'Keine Angabe',
}

export enum RoofAge {
    UNDER_5 = 'Unter 5 Jahre',
    BETWEEN_5_AND_15 = '5–15 Jahre',
    OVER_15 = 'Über 15 Jahre',
    NONE = 'Keine Angabe',
}

export enum Consumption {
    UNDER_3000 = 'Unter 3.000 kWh',
    BETWEEN_3000_AND_5000 = '3.000–5.000 kWh',
    OVER_5000 = 'Über 5.000 kWh',
    NONE = 'Keine Angabe',
}

export enum InterestedOtherSolutions {
    YES = 'Ja',
    NO = 'Nein',
    DONT_KNOW = 'Weiss nicht',
}

export class CreateSurveyDto {
    @ApiProperty({ enum: PropertyType, example: PropertyType.COMMERCIAL })
    @IsNotEmpty()
    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @ApiProperty({ type: [String], enum: RoofOrientation, example: [RoofOrientation.EAST] })
    @IsArray()
    @IsEnum(RoofOrientation, { each: true })
    roofOrientations: RoofOrientation[];

    @ApiProperty({ enum: RoofAge, example: RoofAge.BETWEEN_5_AND_15 })
    @IsNotEmpty()
    @IsEnum(RoofAge)
    roofAge: RoofAge;

    @ApiProperty({ enum: Consumption, example: Consumption.BETWEEN_3000_AND_5000 })
    @IsNotEmpty()
    @IsEnum(Consumption)
    consumption: Consumption;

    @ApiProperty({ enum: InterestedOtherSolutions, example: InterestedOtherSolutions.DONT_KNOW })
    @IsNotEmpty()
    @IsEnum(InterestedOtherSolutions)
    interestedOtherSolutions: InterestedOtherSolutions;

    @ApiPropertyOptional({ type: ContactDto, example: {
      name: 'John Miller',
      email: 'john@example.com',
      phone: '+49123456789',
    }})
    @IsOptional()
    @ValidateNested()
    @Type(() => ContactDto)
    contact?: ContactDto;
}