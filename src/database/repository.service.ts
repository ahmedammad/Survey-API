import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { SurveyEntity } from 'src/survey/types/survey.type';

@Injectable()
export class RepositoryService {

    private readonly file: string;
    private readonly logger = new Logger(RepositoryService.name);
    private writeQueue = Promise.resolve(); // queue for write operations

    constructor() {
        this.file = join(process.cwd(), 'data', 'surveys.json');
    }

    async create(item: SurveyEntity): Promise<SurveyEntity> {
        const items = await this.readFile();
        items.push(item);
        await this.writeFile(items);
        return item;
    }

    private async readFile(): Promise<SurveyEntity[]> {
        try {
            const content = await fs.readFile(this.file, 'utf8');
            return JSON.parse(content) as SurveyEntity[];
        } catch (err: any) {
            this.logger.error('Failed to read file', err);
            throw err;
        }
    }

    private async writeFile(data: SurveyEntity[]): Promise<void> {
        this.writeQueue = this.writeQueue.then(async () => {
            const tmp = `${this.file}.tmp`;
            await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
            await fs.rename(tmp, this.file);
        });
        return this.writeQueue;
    }

    async getAll(): Promise<SurveyEntity[]> {
        return this.readFile();
    }

    async findOne(id: string): Promise<SurveyEntity | undefined> {
        const items = await this.readFile();
        return items.find((i) => i.id === id);
    }

    async delete(id: string): Promise<boolean> {
        const items = await this.readFile();
        const idx = items.findIndex((i) => i.id === id);

        if (idx === -1) return false;

        items.splice(idx, 1);
        await this.writeFile(items);

        return true;
    }

}
