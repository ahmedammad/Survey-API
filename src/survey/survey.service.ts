import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyEntity } from './types/survey.type';
import { RepositoryService } from 'src/database/repository.service';

@Injectable()
export class SurveyService {

    constructor(private readonly repo: RepositoryService) {}

    async createSurvey(dto: CreateSurveyDto): Promise<SurveyEntity> {
        const survey: SurveyEntity = {
            id: Date.now().toString(),
            ...dto,
            createdAt: new Date().toISOString()
        };
        return this.repo.create(survey);
    }

}
