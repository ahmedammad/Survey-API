import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Consumption, InterestedOtherSolutions, PropertyType, RoofAge, RoofOrientation } from "./create-survey.dto";
import { ContactDto } from "./contact.dto";

export class SurveyResponseDto {
    @ApiProperty({ example: '123456789' })
    id: string;

    @ApiProperty({ enum: PropertyType, example: PropertyType.COMMERCIAL })
    propertyType: PropertyType;

    @ApiProperty({ type: [String], enum: RoofOrientation, example: [RoofOrientation.EAST] })
    roofOrientations: RoofOrientation[];

    @ApiProperty({ enum: RoofAge, example: RoofAge.BETWEEN_5_AND_15 })
    roofAge: RoofAge;

    @ApiProperty({ enum: Consumption, example: Consumption.BETWEEN_3000_AND_5000 })
    consumption: Consumption;

    @ApiProperty({ enum: InterestedOtherSolutions, example: InterestedOtherSolutions.DONT_KNOW })
    interestedOtherSolutions: InterestedOtherSolutions;

    @ApiPropertyOptional({ type: ContactDto, example: {
      name: 'John Miller',
      email: 'john@example.com',
      phone: '+49123456789',
    }})
    contact?: ContactDto;

    @ApiProperty({example: '2025-09-26T13:53:12.346Z',})
    createdAt: string;
}