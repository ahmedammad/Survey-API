import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post('submit')
  @ApiCreatedResponse({ description: 'Survey created successfully', type: SurveyResponseDto })
  async createSurvey(@Body() dto: CreateSurveyDto): Promise<SurveyResponseDto> {
    return this.surveyService.createSurvey(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List all surveys', type: [SurveyResponseDto] })
  async getAllSurveys(): Promise<SurveyResponseDto[]> {
    return this.surveyService.getAllSurveys();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get survey by ID', type: SurveyResponseDto })
  async findSurvey(@Param('id') id: string): Promise<SurveyResponseDto> {
    return this.surveyService.findSurvey(id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Survey deleted successfully', type: DeleteResponseDto })
  async deleteSurvey(@Param('id') id: string): Promise<DeleteResponseDto> {
    await this.surveyService.deleteSurvey(id);
    return { success: true };
  }
}
