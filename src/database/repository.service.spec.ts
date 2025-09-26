import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryService } from './repository.service';
import { promises as fs } from 'fs';
import {
  Consumption,
  CreateSurveyDto,
  InterestedOtherSolutions,
  PropertyType,
  RoofAge,
  RoofOrientation,
} from '../survey/dto/create-survey.dto';
import { SurveyResponseDto } from '../survey/dto/survey-response.dto';
import { Logger } from '@nestjs/common';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    rename: jest.fn(),
  },
}));

describe('RepositoryService', () => {
  let service: RepositoryService;

  const createSurveyDto: CreateSurveyDto = {
    propertyType: PropertyType.SINGLE,
    roofOrientations: [RoofOrientation.SOUTH],
    roofAge: RoofAge.UNDER_5,
    consumption: Consumption.UNDER_3000,
    interestedOtherSolutions: InterestedOtherSolutions.YES,
    contact: {
      name: 'Inna',
      email: 'inna@example.com',
      phone: '+49123456789',
    },
  };

  const surveyEntity: SurveyResponseDto = {
    id: '12345',
    ...createSurveyDto,
    createdAt: new Date().toISOString(),
  };
  const fileData = JSON.stringify([surveyEntity]);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepositoryService],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);

    (fs.readFile as jest.Mock).mockResolvedValue(fileData);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.rename as jest.Mock).mockResolvedValue(undefined);
  });

  it('should write the survey to file', async () => {
    const result = await service.create(surveyEntity);

    expect(result).toEqual(surveyEntity);
    expect(fs.readFile).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.rename).toHaveBeenCalled();
  });

  it('should return all surveys', async () => {
    const result = await service.getAll();

    expect(fs.readFile).toHaveBeenCalled();
    expect(result).toEqual([surveyEntity]);
  });

  it('should find survey by id', async () => {
    const result = await service.findOne('12345');

    expect(fs.readFile).toHaveBeenCalled();
    expect(result).toEqual(surveyEntity);
  });

  it('should return undefined if survey not found', async () => {
    const result = await service.findOne('123');

    expect(fs.readFile).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should delete a survey and rewrite file', async () => {
    const result = await service.delete('12345');

    expect(result).toBe(true);
    expect(fs.readFile).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.rename).toHaveBeenCalled();
  });

  it('should return false if survey is not found while deleting', async () => {
    const result = await service.delete('123');

    expect(result).toBe(false);
    expect(fs.readFile).toHaveBeenCalled();
  });

  it('should throw error if readFile fails', async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    (fs.readFile as jest.Mock).mockRejectedValue(new Error('Read file error'));

    expect(fs.readFile).toHaveBeenCalled();
    await expect(service.getAll()).rejects.toThrow('Read file error');
  });

  it('should handle queued writes in order', async () => {
    const surveys: SurveyResponseDto[] = [];
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(surveys));
    (fs.writeFile as jest.Mock).mockImplementation(async (file, data) => {
      surveys.push(JSON.parse(data)[0]);
    });
    (fs.rename as jest.Mock).mockResolvedValue(undefined);

    const promises = [
      service.create(surveyEntity),
      service.create({ ...surveyEntity, id: '6789' }),
    ];
    await Promise.all(promises);

    expect(surveys[0]).toEqual(surveyEntity);
    expect(surveys[1]).toEqual({ ...surveyEntity, id: '6789' });
  });
});
