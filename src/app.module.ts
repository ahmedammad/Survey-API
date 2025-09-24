import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SurveyModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
