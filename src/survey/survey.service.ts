import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { RepositoryService } from '../database/repository.service';

@Injectable()
export class SurveyService {
  constructor(private readonly repo: RepositoryService) {}

  async createSurvey(dto: CreateSurveyDto): Promise<SurveyResponseDto> {
    const survey: SurveyResponseDto = {
      id: Date.now().toString(),
      ...dto,
      createdAt: new Date().toISOString(),
    };
    return this.repo.create(survey);
  }

  async getAllSurveys(): Promise<SurveyResponseDto[]> {
    return this.repo.getAll();
  }

  async findSurvey(id: string): Promise<SurveyResponseDto> {
    const item = await this.repo.findOne(id);

    if (!item) throw new NotFoundException('Survey not found');
    return item;
  }

  async deleteSurvey(id: string): Promise<void> {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundException('Survey not found');
  }
}
