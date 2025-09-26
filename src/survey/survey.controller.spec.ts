import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Consumption, CreateSurveyDto, InterestedOtherSolutions, PropertyType, RoofAge, RoofOrientation } from './dto/create-survey.dto';
import { SurveyEntity } from './types/survey.type';

describe('SurveyController', () => {
  let controller: SurveyController;
  let service: jest.Mocked<SurveyService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        {
          provide: SurveyService,
          useValue: {
            createSurvey: jest.fn(),
            getAllSurveys: jest.fn(),
            findSurvey: jest.fn(),
            deleteSurvey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    service = module.get(SurveyService);
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

  const surveyEntity: SurveyEntity = { id: "12345", ...createSurveyDto, createdAt: new Date().toISOString() };

  it('should create a survey', async () => {
    service.createSurvey.mockResolvedValue(surveyEntity);

    const result = await controller.createSurvey(createSurveyDto);

    expect(result.id).toBeDefined();
    expect(result.id).toBe('12345');
    expect(result.createdAt).toBeDefined();
    expect(result).toMatchObject(surveyEntity);
    expect(service.createSurvey).toHaveBeenCalledWith(createSurveyDto);
  });

  it('should return all surveys', async () => {
    service.getAllSurveys.mockResolvedValue([surveyEntity]);

    const result = await controller.getAllSurveys();
  
    expect(result).toHaveLength(1);
    expect(service.getAllSurveys).toHaveBeenCalled();
  });

  it('should find one survey by id', async () => {
    service.findSurvey.mockResolvedValue(surveyEntity);

    const result = await controller.findSurvey('12345');

    expect(result.id).toEqual('12345');
    expect(service.findSurvey).toHaveBeenCalledWith('12345');
  });

  it('should delete a survey with success true', async () => {
    service.deleteSurvey.mockResolvedValue(undefined);

    const result = await controller.deleteSurvey('12345');

    expect(result.success).toEqual(true);
    expect(service.deleteSurvey).toHaveBeenCalledWith('12345');
  });

});
