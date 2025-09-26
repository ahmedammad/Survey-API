import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { RepositoryService } from '../database/repository.service';
import { Consumption, CreateSurveyDto, InterestedOtherSolutions, PropertyType, RoofAge, RoofOrientation } from './dto/create-survey.dto';
import { NotFoundException } from '@nestjs/common';
import { SurveyResponseDto } from './dto/survey-response.dto';

describe('SurveyService', () => {
  let service: SurveyService;
  let repo: jest.Mocked<RepositoryService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: RepositoryService,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    repo = module.get(RepositoryService);
  });

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

  const surveyEntity: SurveyResponseDto = { id: "12345", ...createSurveyDto, createdAt: new Date().toISOString() };

  it('should create a survey', async () => {
    repo.create.mockResolvedValue(surveyEntity);

    const result = await service.createSurvey(createSurveyDto);

    expect(result.id).toBeDefined();
    expect(result.id).toBe('12345');
    expect(result.createdAt).toBeDefined();
    expect(result).toMatchObject(surveyEntity);
    expect(repo.create).toHaveBeenCalled();
  });

  it('should return all surveys', async () => {
    repo.getAll.mockResolvedValue([surveyEntity]);

    const result = await service.getAllSurveys();

    expect(result).toHaveLength(1);
    expect(repo.getAll).toHaveBeenCalled();
  });

  it('should find survey by id', async () => {
    repo.findOne.mockResolvedValue(surveyEntity);

    const result = await service.findSurvey('12345');

    expect(result.id).toEqual('12345');
    expect(repo.findOne).toHaveBeenCalledWith('12345');
  });

  it('should throw NotFoundException with message if survey not found', async () => {
    repo.findOne.mockResolvedValue(undefined);

    await expect(service.findSurvey('123')).rejects.toThrow(new NotFoundException('Survey not found'));
    expect(repo.findOne).toHaveBeenCalledWith('123');
  });

  it('should delete a survey', async () => {
    repo.delete.mockResolvedValue(true);

    await service.deleteSurvey('12345');

    expect(repo.delete).toHaveBeenCalledWith('12345');
  });

  it('should throw NotFoundException with message if survey not found while deleting', async () => {
    repo.delete.mockResolvedValue(false);

    await expect(service.deleteSurvey('123')).rejects.toThrow(new NotFoundException('Survey not found'));
    expect(repo.delete).toHaveBeenCalledWith('123');
  });

});
