import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ContactDto } from './contact.dto';

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
    @IsNotEmpty()
    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @IsArray()
    @IsEnum(RoofOrientation, { each: true })
    roofOrientations: RoofOrientation[];

    @IsNotEmpty()
    @IsEnum(RoofAge)
    roofAge: RoofAge;

    @IsNotEmpty()
    @IsEnum(Consumption)
    consumption: Consumption;

    @IsNotEmpty()
    @IsEnum(InterestedOtherSolutions)
    interestedOtherSolutions: InterestedOtherSolutions;

    @IsOptional()
    contact?: ContactDto;
}