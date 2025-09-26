import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { RepositoryService } from '../src/database/repository.service';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  Consumption,
  InterestedOtherSolutions,
  PropertyType,
  RoofAge,
  RoofOrientation,
} from '../src/survey/dto/create-survey.dto';

describe('SurveyController (e2e)', () => {
  let app: INestApplication;
  let repo: RepositoryService;
  const filePath = join(process.cwd(), 'data', 'surveys.json');

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    repo = moduleFixture.get(RepositoryService);
  });

  beforeEach(async () => {
    // reset file before each test
    await fs.writeFile(filePath, '[]', 'utf8');
  });

  afterAll(async () => {
    await app.close();
  });

  const survey = {
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

  it('/POST api/survey/submit (create survey)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/survey/submit')
      .send(survey)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body.consumption).toBe(survey.consumption);
    expect(res.body.propertyType).toBe(survey.propertyType);
  });

  it('/POST api/survey/submit (create survey - without contact info)', async () => {
    const { contact, ...tmpSurvey } = survey;

    const res = await request(app.getHttpServer())
      .post('/api/survey/submit')
      .send(tmpSurvey)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body.consumption).toBe(survey.consumption);
    expect(res.body.propertyType).toBe(survey.propertyType);
  });

  it('/POST api/survey/submit (create survey - invalid propertyType)', async () => {
    const tmpSurvey = {
      ...survey,
      propertyType: 'building',
    };

    const res = await request(app.getHttpServer())
      .post('/api/survey/submit')
      .send(tmpSurvey)
      .expect(400);

    expect(res.body.message).toContain(
      'propertyType must be one of the following values: Einfamilienhaus, Mehrfamilienhaus, Gewerbeimmobilie',
    );
  });

  it('/POST api/survey/submit (create survey - invalid roofOrientations)', async () => {
    const tmpSurvey = {
      ...survey,
      roofOrientations: ['Süd', 'up'],
    };

    const res = await request(app.getHttpServer())
      .post('/api/survey/submit')
      .send(tmpSurvey)
      .expect(400);

    expect(res.body.message).toContain(
      'each value in roofOrientations must be one of the following values: Süd, West, Ost, Nord, Keine Angabe',
    );
  });

  it('/POST api/survey/submit (create survey - invalid phone)', async () => {
    const tmpSurvey = {
      ...survey,
      contact: { ...survey.contact, phone: '1234' },
    };

    const res = await request(app.getHttpServer())
      .post('/api/survey/submit')
      .send(tmpSurvey)
      .expect(400);

    expect(res.body.message).toContain('contact.Phone number must be a valid international format');
  });

  it('/POST api/survey/submit (create survey - invalid email)', async () => {
    const tmpSurvey = {
      ...survey,
      contact: { ...survey.contact, email: 'abc.com' },
    };

    const res = await request(app.getHttpServer())
      .post('/api/survey/submit')
      .send(tmpSurvey)
      .expect(400);

    expect(res.body.message).toContain('contact.email must be an email');
  });

  it('/GET api/survey (empty list)', async () => {
    const res = await request(app.getHttpServer()).get('/api/survey').expect(200);

    expect(res.body).toEqual([]);
  });

  it('/GET api/survey (list of all surveys)', async () => {
    const tmpSurvey = await repo.create({
      id: '123456789',
      ...survey,
      createdAt: new Date().toISOString(),
    });

    const res = await request(app.getHttpServer()).get('/api/survey').expect(200);

    expect(res.body).toEqual([tmpSurvey]);
  });

  it('/GET api/survey/:id (get survey by id)', async () => {
    const tmpSurvey = await repo.create({
      id: '123456789',
      ...survey,
      createdAt: new Date().toISOString(),
    });

    const res = await request(app.getHttpServer()).get(`/api/survey/${tmpSurvey.id}`).expect(200);

    expect(res.body).toEqual(tmpSurvey);
  });

  it('/GET api/survey/:id (survey not found)', async () => {
    const res = await request(app.getHttpServer()).get('/api/survey/someid').expect(404);

    expect(res.body.message).toBe('Survey not found');
  });

  it('/DELETE api/survey/:id (delete existing survey by id)', async () => {
    const tmpSurvey = await repo.create({
      id: '123456789',
      ...survey,
      createdAt: new Date().toISOString(),
    });

    const res = await request(app.getHttpServer())
      .delete(`/api/survey/${tmpSurvey.id}`)
      .expect(200);

    expect(res.body).toEqual({ success: true });
  });

  it('/DELETE api/survey/:id (survey not found while deleting)', async () => {
    const res = await request(app.getHttpServer()).delete('/api/survey/someid').expect(404);

    expect(res.body.message).toBe('Survey not found');
  });
});
