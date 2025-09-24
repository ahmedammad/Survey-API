import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Controller('survey')
export class SurveyController {

    constructor(private readonly surveyService: SurveyService) {}

    @Post('submit')
    async createSurvey(@Body() dto: CreateSurveyDto) {
        return this.surveyService.createSurvey(dto);
    }

    @Get()
    async getAllSurveys() {
        return this.surveyService.getAllSurveys();
    }

    @Get(':id')
    async findSurvey(@Param('id') id: string) {
        return this.surveyService.findSurvey(id);
    }

    @Delete(':id')
    async deleteSurvey(@Param('id') id: string) {
        await this.surveyService.deleteSurvey(id);
        return { success: true };
    }

}
