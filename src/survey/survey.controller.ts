import { Body, Controller, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Controller('survey')
export class SurveyController {

    constructor(private readonly surveyService: SurveyService) {}

    @Post('submit')
    async submit(@Body() dto: CreateSurveyDto) {
        return this.surveyService.createSurvey(dto);
    }

}
