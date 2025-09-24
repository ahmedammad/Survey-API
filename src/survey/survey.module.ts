import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { RepositoryService } from 'src/database/repository.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, RepositoryService]
})
export class SurveyModule {}
