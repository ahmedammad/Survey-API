import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyEntity } from './types/survey.type';
import { RepositoryService } from '../database/repository.service';

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

    async getAllSurveys(): Promise<SurveyEntity[]> {
        return this.repo.getAll();
    }

    async findSurvey(id: string): Promise<SurveyEntity> {
        const item = await this.repo.findOne(id);

        if (!item) throw new NotFoundException('Survey not found');
        return item;
    }

    async deleteSurvey(id: string): Promise<void> {
        const ok = await this.repo.delete(id);
        if (!ok) throw new NotFoundException('Survey not found');
    }

}
